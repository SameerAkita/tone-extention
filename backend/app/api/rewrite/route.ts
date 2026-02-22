import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import OpenAI from "openai";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const startedAt = Date.now();
  try {
    const body = await req.json();
    const { text, tone } = body as { text?: string; tone?: string };

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY" },
        { status: 500 },
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

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            `Rewrite text while preserving meaning and factual details in a ${safeTone} tone. Return only the rewritten text.`,
        },
        {
          role: "user",
          content: `Tone: ${safeTone}\n\nText:\n${boundedText}`,
        },
      ],
    });

    console.log("openai usage", {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      totalTokens: response.usage?.total_tokens,
    });

    const rewritten = response.output_text?.trim();

    if (!rewritten) {
      console.log("openai empty output_text", {
        id: response.id,
        status: response.status,
        outputLength: response.output?.length ?? 0,
      });
      return NextResponse.json(
        { error: "OpenAI did not return rewritten text" },
        { status: 502 },
      );
    }

    const elapsedMs = Date.now() - startedAt;
    console.log("rewrite completed", {
      userId: authPayload.sub,
      tone: safeTone,
      inputChars: boundedText.length,
      elapsedMs,
    });

    return NextResponse.json({ rewrittenText: rewritten });
  } catch (err) {
    console.error("rewrite failed", {
      elapsedMs: Date.now() - startedAt,
      err,
    });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
