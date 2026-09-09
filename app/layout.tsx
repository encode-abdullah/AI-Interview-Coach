import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { LoadingScreen } from "@/components/ui/loading-screen";
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
      <body id="app-body" className="min-h-full flex flex-col">
        <LoadingScreen />
        <NavBar />
        <main id="app-main" className="flex-1">{children}</main>
        <footer id="app-footer" className="border-t border-white/10 bg-black py-4 text-center text-xs text-gray-500">
          Follow github.com/encode-abdullah
        </footer>
      </body>
    </html>
  );
}
