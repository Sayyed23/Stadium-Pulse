"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function SharedShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pageTitle: Record<string, string> = {
    "/profile": "Profile",
    "/notifications": "Notifications",
    "/help": "Help Center",
    "/faq": "FAQ",
    "/privacy": "Privacy Policy",
    "/terms": "Terms of Service",
    "/contact": "Contact Support",
    "/about": "About",
    "/offline": "Offline",
  };

  const title = pageTitle[pathname] || "StadiumPulse";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      <header className="h-16 flex items-center gap-4 px-6 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
        <Link
          href="/"
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Back to previous page"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-[10px] tracking-tighter">
              SP
            </span>
          </div>
          <span className="font-semibold text-lg">{title}</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
