"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import CopyButton from "@/components/CopyButton";

export default function PrepPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Paste a job description first");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "questions",
          jobDescription: jobDescription.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const parseQuestions = (text: string) => {
    const sections = text.split(/### Q\d+:/);
    return sections
      .filter((s) => s.trim())
      .map((section) => {
        const lines = section.trim().split("\n");
        const question = lines[0]?.trim() || "";
        const answer = lines
          .slice(1)
          .join("\n")
          .replace(/\*\*Answer:\*\*/g, "")
          .trim();
        return { question, answer };
      });
  };

  const questions = result ? parseQuestions(result) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Interview Prep
      </h1>
      <p className="text-gray-600 mb-6">
        Paste the job description below and get tailored interview questions
        with STAR-format answers.
      </p>

      <div className="mb-6">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Generating questions..." : "Generate Questions"}
      </button>

      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500 mt-2">
            AI is analyzing the job description...
          </p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Interview Questions
            </h2>
            <CopyButton text={result} />
          </div>
          <div className="space-y-4">
            {questions.map((q, i) => (
              <QuestionCard key={i} question={q.question} answer={q.answer} />
            ))}
          </div>
        </div>
      )}

      {result && !result.includes("### Q1:") && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Result
          </h2>
          <div className="border border-gray-200 rounded-lg p-5 bg-white whitespace-pre-line text-sm leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
