"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function PracticePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startInterview = () => {
    if (!jobDescription.trim()) return;
    setStarted(true);
    setQuestionCount(1);
    setMessages([
      {
        role: "ai",
        content:
          "Let's begin the mock interview. I'll ask you questions one at a time and score your answers.\n\nFirst question: Tell me about yourself and why you're interested in this role.",
      },
    ]);
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || loading) return;

    const userMsg = { role: "user" as const, content: userAnswer.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setUserAnswer("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "mock",
          jobDescription,
          conversationHistory: newMessages
            .map((m) => `${m.role === "user" ? "Candidate" : "Coach"}: ${m.content}`)
            .join("\n\n"),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      let hasError = false;

      const aiMsg = { role: "ai" as const, content: "" };
      setMessages([...newMessages, aiMsg]);

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
            if (parsed.error) {
              fullText = "Error: " + parsed.error;
              setMessages([...newMessages, { role: "ai", content: fullText }]);
              hasError = true;
              break;
            }
            if (typeof parsed.text === "string") {
              fullText += parsed.text;
              setMessages([...newMessages, { role: "ai", content: fullText }]);
            }
          } catch {
            // skip
          }
        }

        if (hasError) break;
      }

      // Only increment question count on success
      if (!hasError && fullText) {
        setQuestionCount((c) => c + 1);
      }
      // If no text was received, show error
      if (!fullText) {
        setMessages([
          ...newMessages,
          { role: "ai", content: "Sorry, I couldn't generate a response. Please try again." },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: "Sorry, something went wrong. Let's try that again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!started) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mock Interview
        </h1>
        <p className="text-gray-600 mb-6">
          Practice answering interview questions. Paste the job description
          and I&apos;ll conduct a mock interview, scoring your answers as we go.
        </p>

        <textarea
          id="practice-jd"
          name="practice-jd"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm mb-4"
        />

        <button
          onClick={startInterview}
          disabled={!jobDescription.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Interview
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Mock Interview
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Question {questionCount}
          </span>
          <button
            onClick={() => {
              setStarted(false);
              setMessages([]);
              setQuestionCount(0);
              setUserAnswer("");
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Start over
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 sm:p-4 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-50 border border-blue-200 ml-4 sm:ml-8"
                : "bg-gray-50 border border-gray-200 mr-4 sm:mr-8"
            }`}
          >
            <p className="text-xs font-medium text-gray-500 mb-1">
              {msg.role === "user" ? "You" : "Coach"}
            </p>
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {msg.content}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mr-4 sm:mr-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2 sm:gap-3">
        <textarea
          id="answer"
          name="answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none h-20 sm:h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              submitAnswer();
            }
          }}
          disabled={loading}
        />
        <button
          onClick={submitAnswer}
          disabled={!userAnswer.trim() || loading}
          className="self-end bg-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Submit
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Press Ctrl+Enter to submit
      </p>
    </div>
  );
}
