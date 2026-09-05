import { NextRequest } from "next/server";
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
      return new Response(
        JSON.stringify({ error: "Job description is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Check your API key and try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
