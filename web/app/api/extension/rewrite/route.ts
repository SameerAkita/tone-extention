import { OpenAI } from "openai";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ExtensionTokenPayload = {
    sub: string;
    email?: string;
    aud: string;
    iss: string;
    iat: number;
    exp: number;
    jti?: string;
};

type ProfileAccessRecord = {
    stripe_subscription_status: string | null;
};

function fromBase64Url(input: string) {
    const pad = "=".repeat((4 - (input.length % 4)) % 4);
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
    return Buffer.from(base64, "base64").toString("utf8");
}

function verifyExtensionToken(
    token: string,
    secret: string,
): ExtensionTokenPayload {
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Malformed token");
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const unsigned = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = createHmac("sha256", secret)
        .update(unsigned)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const actualSig = Buffer.from(encodedSignature, "utf8");
    const expectedSig = Buffer.from(expectedSignature, "utf8");

    if (
        actualSig.length !== expectedSig.length ||
        !timingSafeEqual(actualSig, expectedSig)
    ) {
        throw new Error("Invalid signature");
    }

    const payload = JSON.parse(
        fromBase64Url(encodedPayload),
    ) as ExtensionTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!payload.sub) throw new Error("Missing sub");
    if (payload.exp <= now) throw new Error("Token expired");
    if (payload.aud !== "tone-extension") throw new Error("Invalid audience");
    if (payload.iss !== "tone-web") throw new Error("Invalid issuer");

    return payload;
}

export async function POST(req: Request) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401});
    }

    const extensionTokenSecret = process.env.EXTENSION_TOKEN_SECRET;
    if (!extensionTokenSecret) {
        return NextResponse.json(
            { error: "Server missing EXTENSION_TOKEN_SECRET" },
            { status: 500 },
        );
    }

    const token = auth.slice("Bearer ".length).trim();
    let authPayload: ExtensionTokenPayload;
    try {
        authPayload = verifyExtensionToken(token, extensionTokenSecret);
    } catch (err) {
        console.log("auth failed", err);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const admin = createAdminClient();
        const { data: profile, error: profileError } = await admin
            .from("profiles")
            .select("stripe_subscription_status")
            .eq("id", authPayload.sub)
            .maybeSingle<ProfileAccessRecord>();

        if (profileError) {
            console.error("profile lookup failed", {
                userId: authPayload.sub,
                profileError,
            });
            return NextResponse.json(
                { error: "Failed to verify subscription" },
                { status: 500 },
            );
        }

        if (!hasRewriteAccess(profile?.stripe_subscription_status)) {
            return NextResponse.json(
                { error: "An active subscription or trial is required to rewrite text." },
                { status: 403 },
            );
        }
    } catch (err) {
        console.error("subscription check failed", {
            userId: authPayload.sub,
            err,
        });
        return NextResponse.json(
            { error: "Failed to verify subscription" },
            { status: 500 },
        );
    }

    const startedAt = Date.now();
    try {
        const body = await req.json();
        const { text, tone } = body as { text?: string; tone?: string };

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "Server is missing OPENAI_API_KEY" },
                { status: 500 }
            );
        }

        if (!text?.trim()) {
            return NextResponse.json({ error: "Missing text" }, { status: 400 });
        }

        const trimmedText = text.trim();
        const MAX_INPUT_CHARS = 4000;
        const boundedText =
            trimmedText.length > MAX_INPUT_CHARS
                ? trimmedText.slice(0, MAX_INPUT_CHARS)
                : trimmedText;
        const safeTone = tone ?? "business";

        const encoder = new TextEncoder();
        let streamedText = "";
        let firstTokenAt: number | null = null;

        const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
                try {
                    const response = await client.responses.create({
                        model: "gpt-5-nano",
                        stream: true,
                        input: [
                            {
                                role: "system",
                                content: `Rewrite text in a ${safeTone} tone. Return only the rewritten text.`,
                            },
                            {
                                role: "user",
                                content: `Tone: ${safeTone}\n\nText:\n${boundedText}`,
                            }
                        ]
                    });

                    for await (const event of response) {
                        if (event.type === "response.output_text.delta") {
                            if (firstTokenAt === null) {
                                firstTokenAt = Date.now();
                                console.log("rewrite first token", {
                                    userId: authPayload.sub,
                                    tone: safeTone,
                                    inputChars: boundedText.length,
                                    timeToFirstTokenMs: firstTokenAt - startedAt,
                                });
                            }

                            streamedText += event.delta;
                            controller.enqueue(encoder.encode(event.delta));
                            continue;
                        }

                        if (event.type === "response.completed") {
                            console.log("openai usage", {
                                inputTokens: event.response.usage?.input_tokens,
                                outputTokens: event.response.usage?.output_tokens,
                                totalTokens: event.response.usage?.total_tokens,
                            });
                        }
                    }

                    const rewritten = streamedText.trim();
                    if (!rewritten) {
                        throw new Error("OpenAI did not return rewritten text");
                    }

                    const elapsedMs = Date.now() - startedAt;
                    console.log("rewrite completed", {
                        userId: authPayload.sub,
                        tone: safeTone,
                        inputChars: boundedText.length,
                        timeToFirstTokenMs:
                            firstTokenAt === null ? null : firstTokenAt - startedAt,
                        elapsedMs,
                        outputChars: rewritten.length,
                    });

                    controller.close();
                } catch (err) {
                    console.error("rewrite stream failed", {
                        elapsedMs: Date.now() - startedAt,
                        err,
                    });
                    controller.error(err);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
            },
        });
    } catch (err) {
        console.error("rewrite failed", {
            elapsedMs: Date.now() - startedAt,
            err,
        });
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        )
    }
}

function hasRewriteAccess(subscriptionStatus: string | null | undefined) {
    return subscriptionStatus === "trialing" || subscriptionStatus === "active";
}
