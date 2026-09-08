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
        <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
          <div id="layout-nav-inner" className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-base sm:text-lg font-semibold text-white">
              <span className="hidden sm:inline">Interview Prep Coach</span>
              <span className="sm:hidden">IPC</span>
            </Link>
            <div id="layout-nav-links" className="flex gap-3 sm:gap-4 text-sm">
              <Link href="/prep" className="text-gray-400 hover:text-white transition-colors">
                Prep
              </Link>
              <Link href="/practice" className="text-gray-400 hover:text-white transition-colors">
                Practice
              </Link>
              <a
                href="https://github.com/encode-abdullah/AI-Interview-Coach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 bg-black py-4 text-center text-xs text-gray-500">
          Follow github.com/encode-abdullah
        </footer>
      </body>
    </html>
  );
}
