import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const auth = req.headers.get("authorization")

    if (!auth || !auth.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        )
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