import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildQuestionsPrompt, buildMockInterviewPrompt } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, jobDescription, conversationHistory } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    let prompt: string;

    if (mode === "mock") {
      prompt = buildMockInterviewPrompt(
        jobDescription,
        conversationHistory || "This is the start of the interview."
      );
    } else {
      prompt = buildQuestionsPrompt(jobDescription);
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Check your API key and try again." },
      { status: 500 }
    );
  }
}
