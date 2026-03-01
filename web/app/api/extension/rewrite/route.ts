import { OpenAI } from "openai";

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
}

export async function POST(req: Request) {
    const auth = req.headers.get("authorization");
}