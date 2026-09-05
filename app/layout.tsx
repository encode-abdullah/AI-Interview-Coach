import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interview Prep Coach — AI-Powered",
  description: "Paste a job description. Get tailored interview questions with STAR answers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-gray-900">
              Interview Prep Coach
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/prep" className="text-gray-600 hover:text-gray-900">
                Prep
              </Link>
              <Link href="/practice" className="text-gray-600 hover:text-gray-900">
                Practice
              </Link>
              <a
                href="https://github.com/encode-abdullah/AI-Interview-Coach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
          Built with Next.js + Claude AI
        </footer>
      </body>
    </html>
  );
}
