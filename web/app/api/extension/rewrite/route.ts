import { OpenAI } from "openai";
import { createHmac } from "node:crypto";

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
}

export async function POST(req: Request) {
    const auth = req.headers.get("authorization");
}