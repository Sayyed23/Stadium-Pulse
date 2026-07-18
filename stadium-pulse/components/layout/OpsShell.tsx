"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Leaf,
  Users,
  BarChart3,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";

export function OpsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/ops/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ops/crowd", label: "Crowd Monitor", icon: Activity },
    { href: "/ops/alerts", label: "Alerts", icon: AlertTriangle },
    { href: "/ops/copilot", label: "Copilot", icon: FileText },
    { href: "/ops/incidents", label: "Incidents", icon: ShieldAlert },
    { href: "/ops/volunteers", label: "Volunteers", icon: Users },
    { href: "/ops/sustainability", label: "Sustainability", icon: Leaf },
    { href: "/ops/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/ops/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800/50">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center shadow-md">
              <span className="text-white dark:text-slate-900 font-bold text-xs tracking-tighter">SP</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight">StadiumPulse <span className="font-light">Ops</span></h1>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/ops/dashboard" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "text-blue-700 dark:text-blue-300 font-medium" 
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-all" />
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-1/2 top-1/4 bg-blue-600 dark:bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                )}
                <Icon size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
          <Link
            href="/ops/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-slate-50 dark:bg-slate-950/50">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            {navItems.find(i => i.href === pathname || (i.href !== "/ops/dashboard" && pathname.startsWith(i.href + "/")))?.label || "Dashboard"}
          </h2>
        </header>
        <div className="p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
