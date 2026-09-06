"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

interface QuestionCardProps {
  question: string;
  answer: string;
  index: number;
}

export default function QuestionCard({ question, answer, index }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg bg-white overflow-hidden transition-colors ${expanded ? "border-blue-200" : "border-gray-200"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium flex items-center justify-center">
          {index}
        </span>
        <span className="font-medium text-gray-900 flex-1 text-sm sm:text-base leading-snug">{question}</span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100">
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">STAR Answer</span>
            <CopyButton text={answer} />
          </div>
          <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}
