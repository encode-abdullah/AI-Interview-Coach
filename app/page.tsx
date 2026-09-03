import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Stop Googling Interview Questions.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Paste a job description. Get tailored interview questions with structured STAR answers.
            Powered by AI.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/prep"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Preparing
            </Link>
            <Link
              href="/practice"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Mock Interview
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-900">Paste Any JD</h3>
            <p className="text-sm text-gray-600 mt-1">
              Works with any job description — tech, design, marketing, anything.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900">Tailored Questions</h3>
            <p className="text-sm text-gray-600 mt-1">
              AI generates questions specific to that role, not generic lists.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-900">STAR Answers</h3>
            <p className="text-sm text-gray-600 mt-1">
              Each question comes with a structured answer you can actually use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
