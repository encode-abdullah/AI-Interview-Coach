import { NextRequest } from "next/server";
import { buildQuestionsPrompt, buildMockInterviewPrompt } from "@/lib/prompts";

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

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;

    if (!apiKey || apiKey === "your_api_key_here") {
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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };

    if (workspaceId) {
      headers["anthropic-workspace-id"] = workspaceId;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", response.status, errorData);
      const msg = errorData?.error?.message || `API error: ${response.status}`;
      return new Response(
        JSON.stringify({ error: msg }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Transform SSE stream from Anthropic to our format
    const encoder = new TextEncoder();
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const readable = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
                  const text = parsed.delta.text || "";
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                  }
                }
              } catch {
                // skip
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          console.error("Stream transform error:", err);
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
    console.error("API route error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Check your API key and try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
