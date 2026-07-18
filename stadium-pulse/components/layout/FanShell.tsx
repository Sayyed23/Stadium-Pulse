"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Map as MapIcon, Navigation } from "lucide-react";

export function FanShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/assistant", label: "Assistant", icon: MessageSquare },
    { href: "/map", label: "Map", icon: MapIcon },
    { href: "/transport", label: "Transport", icon: Navigation },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <main className="flex-1 pb-16 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-around items-center h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              <Icon size={24} className={isActive ? "fill-current" : ""} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
