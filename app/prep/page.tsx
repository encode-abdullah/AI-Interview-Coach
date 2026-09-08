"use client";

import { useState, useRef } from "react";
import QuestionCard from "@/components/QuestionCard";
import CopyButton from "@/components/CopyButton";
import { GradientWave } from "@/components/ui/gradient-wave";

export default function PrepPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Paste a job description first");
      return;
    }

    if (loading) {
      abortRef.current?.abort();
      setLoading(false);
      return;
    }

    setError("");
    setLoading(true);
    setResult("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "questions",
          jobDescription: jobDescription.trim(),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      let hasError = false;

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
              setError(parsed.error);
              hasError = true;
              break;
            }
            if (typeof parsed.text === "string") {
              fullText += parsed.text;
              setResult(fullText);
            }
          } catch {
            // skip malformed chunks
          }
        }

        if (hasError) break;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // user cancelled
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const parseQuestions = (text: string) => {
    const results: { question: string; answer: string }[] = [];

    // Find lines that look like question headers
    const lines = text.split("\n");
    let currentQuestion = "";
    let currentAnswer: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Check if this line is a question header
      const isQuestion =
        /^###\s*Q\d+/i.test(trimmed) ||
        /^\*\*Q\d+/i.test(trimmed) ||
        /^Q\d+[\.:]/i.test(trimmed) ||
        /^\d+[\.\)]\s+\S/.test(trimmed);

      if (isQuestion) {
        // Save previous question if exists
        if (currentQuestion) {
          results.push({
            question: currentQuestion,
            answer: currentAnswer.join("\n").trim(),
          });
        }
        // Extract question text — remove markers
        currentQuestion = trimmed
          .replace(/^###\s*/i, "")
          .replace(/^\*\*/g, "")
          .replace(/^Q\d+[\.:]\s*/i, "")
          .replace(/^\d+[\.\)]\s+/, "")
          .replace(/\*\*$/g, "")
          .trim();
        currentAnswer = [];
      } else if (currentQuestion && trimmed) {
        currentAnswer.push(line);
      }
    }

    // Save last question
    if (currentQuestion) {
      results.push({
        question: currentQuestion,
        answer: currentAnswer
          .join("\n")
          .replace(/\*\*Answer:\*\*/g, "")
          .replace(/\*\*Situation:\*\*/g, "Situation:")
          .replace(/\*\*Task:\*\*/g, "Task:")
          .replace(/\*\*Action:\*\*/g, "Action:")
          .replace(/\*\*Result:\*\*/g, "Result:")
          .trim(),
      });
    }

    return results.filter((q) => q.question.length > 3);
  };

  const questions = result ? parseQuestions(result) : [];

  return (
    <div id="prep-root" className="relative min-h-screen">
      <GradientWave
        colors={["#0a0a0a", "#1a1030", "#0f0a1a", "#1a1030", "#0a0a0a", "#1a1030"]}
        shadowPower={8}
        darkenTop={false}
      />
      <div id="prep-content" className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-white mb-2">
          Interview Prep
        </h1>
        <p className="text-gray-400 mb-6">
          Paste the job description below and get tailored interview questions
          with STAR-format answers.
        </p>

        <div id="prep-input-group" className="mb-6">
          <textarea
            id="job-description"
            name="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-40 p-4 border border-white/10 bg-white/5 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm text-white placeholder-gray-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            loading
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-white text-black hover:bg-gray-200"
          }`}
        >
          {loading ? "Stop generating" : "Generate Questions"}
        </button>

        {loading && !result && (
          <div id="prep-loading" className="mt-8 text-center">
            <div id="prep-spinner" className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <p className="text-sm text-gray-400 mt-2">
              AI is analyzing the job description...
            </p>
          </div>
        )}

        {result && (
          <div id="prep-results" className="mt-10">
            <div id="prep-results-header" className="flex items-center justify-between mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Your Interview Questions
              </h2>
              <CopyButton text={result} />
            </div>

            {questions.length > 0 ? (
              <div id="prep-questions-list" className="space-y-3">
                {questions.map((q, i) => (
                  q.question ? (
                    <QuestionCard key={i} question={q.question} answer={q.answer || "No answer provided"} index={i + 1} />
                  ) : null
                ))}
              </div>
            ) : (
              <div id="prep-fallback" className="border border-white/10 rounded-lg p-5 bg-white/5 whitespace-pre-line text-sm leading-relaxed text-gray-300">
                {result}
              </div>
            )}
          </div>
        )}

        {!loading && !result && (
          <div id="prep-empty-state" className="mt-10 text-center text-gray-500">
            <p className="text-sm">Your questions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
