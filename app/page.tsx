import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-medium text-blue-600 mb-4">
            Built with Claude AI
          </p>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl tracking-tight">
            Stop Googling Interview Questions.
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Paste a job description. Get tailored interview questions with structured STAR answers.
          </p>
          <div className="mt-8 flex gap-3 justify-center">
            <Link
              href="/prep"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Start Preparing
            </Link>
            <Link
              href="/practice"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-white hover:border-gray-400 transition-colors text-sm"
            >
              Mock Interview
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900 text-sm">Paste Any JD</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Works with any job description — tech, design, marketing, anything.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 text-sm">Tailored Questions</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              AI generates questions specific to that role, not generic lists.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <h3 className="font-semibold text-gray-900 text-sm">STAR Answers</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Each question comes with a structured answer you can actually use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
