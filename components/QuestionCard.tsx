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
    <div id="qcard-root" className={`border rounded-lg overflow-hidden transition-colors ${expanded ? "border-purple-500/30 bg-white/5" : "border-white/10 bg-white/5"}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5 flex items-start gap-3 hover:bg-white/5 transition-colors"
      >
        <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium flex items-center justify-center">
          {index}
        </span>
        <span className="font-medium text-white flex-1 text-sm sm:text-base leading-snug">{question}</span>
        <svg
          id="qcard-chevron"
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div id="qcard-answer-panel" className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/10">
          <div id="qcard-answer-header" className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">STAR Answer</span>
            <CopyButton text={answer} />
          </div>
          <div id="qcard-answer-body" className="mt-3 text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}
