"use client";

interface QuestionCardProps {
  question: string;
  answer: string;
}

export default function QuestionCard({ question, answer }: QuestionCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white">
      <h3 className="font-semibold text-gray-900 text-lg mb-3">{question}</h3>
      <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
        {answer}
      </div>
    </div>
  );
}
