import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ClientSecrets } from "openai/resources/realtime.mjs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text, tone } = body;
        
        if (!text) {
            return NextResponse.json(
                { error: "Missing text" },
                { status: 400 }
            );
        }

        return NextResponse.json({ "hello": "hello" })
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}