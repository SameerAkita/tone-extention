import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
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

    const safeTone = tone ?? "business";

    const response = await client.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            `Rewrite text while preserving meaning and factual details in a ${tone} tone. Return only the rewritten text`,
        },
        {
          role: "user",
          content: `Tone: ${safeTone}\n\nText:\n${text}`,
        },
      ],
    });

    const rewritten = response.output_text?.trim();

    if (!rewritten) {
      return NextResponse.json(
        { error: "OpenAI did not return rewritten text" },
        { status: 502 },
      );
    }

    return NextResponse.json({ rewrittenText: rewritten });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
