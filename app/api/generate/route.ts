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

    if (!jobDescription || !jobDescription.trim()) {
      return new Response(
        JSON.stringify({ error: "Please paste a job description first." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (jobDescription.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Job description seems too short. Paste the full listing for better results." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_api_key_here") {
      return new Response(
        JSON.stringify({ error: "API key not configured. Add your Anthropic API key to .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
        try {
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
        } catch (streamError) {
          console.error("Stream error:", streamError);
          const errorMsg = streamError instanceof Error ? streamError.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
          );
        } finally {
          controller.close();
        }
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

    if (error instanceof Anthropic.AuthenticationError) {
      return new Response(
        JSON.stringify({ error: "Invalid API key. Check your ANTHROPIC_API_KEY in .env.local" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof Anthropic.RateLimitError) {
      return new Response(
        JSON.stringify({ error: "Rate limited. Wait a minute and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Something went wrong. Check your API key and try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
