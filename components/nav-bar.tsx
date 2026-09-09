"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScatterLink } from "@/components/ui/scatter-link";

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav id="site-nav" className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <header id="nav-header" className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-base sm:text-lg font-semibold text-white">
          <span id="nav-brand-full" className="hidden sm:inline">Interview Preparation Coach</span>
          <span id="nav-brand-short" className="sm:hidden">IPC</span>
        </Link>
        <ul id="nav-links" className="flex items-center rounded-lg border border-white/20 bg-black overflow-hidden list-none p-0 m-0">
          <li id="nav-prep-item" className={`px-5 py-2 transition-colors ${pathname === "/prep" ? "bg-white" : ""}`}>
            <ScatterLink href="/prep" label="Preparation" active={pathname === "/prep"} />
          </li>
          <li id="nav-divider" className="w-px h-6.5 bg-white/40" role="separator"></li>
          <li id="nav-practice-item" className={`px-5 py-2 transition-colors ${pathname === "/practice" ? "bg-white" : ""}`}>
            <ScatterLink href="/practice" label="Interview" active={pathname === "/practice"} />
          </li>
        </ul>
      </header>
    </nav>
  );
}
