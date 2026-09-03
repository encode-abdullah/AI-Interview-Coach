"use client";

import { useState } from "react";

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

  const startInterview = () => {
    if (!jobDescription.trim()) return;
    setStarted(true);
    setMessages([
      {
        role: "ai",
        content:
          "Let's begin the mock interview. I'll ask you questions one at a time. Take your time to think before answering.\n\nFirst question: Tell me about yourself and why you're interested in this role.",
      },
    ]);
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim() || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userAnswer.trim() },
    ];
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

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to get response");

      setMessages([...newMessages, { role: "ai", content: data.result }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "ai",
          content: "Sorry, something went wrong. Let's try again.",
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mock Interview
      </h1>

      <div className="space-y-4 mb-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-50 border border-blue-200 ml-8"
                : "bg-gray-50 border border-gray-200 mr-8"
            }`}
          >
            <p className="text-xs font-medium text-gray-500 mb-1">
              {msg.role === "user" ? "You" : "Coach"}
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {msg.content}
            </p>
          </div>
        ))}

        {loading && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mr-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) {
              submitAnswer();
            }
          }}
        />
        <button
          onClick={submitAnswer}
          disabled={!userAnswer.trim() || loading}
          className="self-end bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Submit
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Press Cmd+Enter to submit
      </p>
    </div>
  );
}
