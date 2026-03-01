import { OpenAI } from "openai";
import { createHmac, timingSafeEqual } from "node:crypto";

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

    const payload = JSON.parse()
}

export async function POST(req: Request) {
    const auth = req.headers.get("authorization");
}