"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  AlertTriangle,
  ListChecks,
  MessageSquare,
  Navigation,
  UserCircle2,
  Radio,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/volunteer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/volunteer/copilot", label: "Copilot", icon: Bot },
  { href: "/volunteer/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/volunteer/tasks", label: "Tasks", icon: ListChecks },
  { href: "/volunteer/messages", label: "Messages", icon: MessageSquare },
  { href: "/volunteer/navigation", label: "Navigation", icon: Navigation },
  { href: "/volunteer/profile", label: "Profile", icon: UserCircle2 },
];

export function VolunteerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-[72px]" : "w-64"
        } bg-white dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-xl transition-all duration-300`}
      >
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800/50 justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
              <span className="text-white font-bold text-xs tracking-tighter">
                SP
              </span>
            </div>
            {!collapsed && (
              <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">
                StadiumPulse{" "}
                <span className="font-light text-teal-500">Vol</span>
              </h1>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* Availability Status */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">
                Available
              </span>
            </div>
          </div>
        )}

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/volunteer" &&
                pathname.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "text-teal-700 dark:text-teal-300 font-medium"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-teal-50 dark:bg-teal-900/20 rounded-xl transition-all" />
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-1/2 top-1/4 bg-teal-500 rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
                )}
                <Icon
                  size={20}
                  className="relative z-10 shrink-0 group-hover:scale-110 transition-transform"
                />
                {!collapsed && (
                  <span className="relative z-10 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800/50">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronLeft size={20} className="shrink-0" />
            {!collapsed && <span className="font-medium">Back to Home</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col relative bg-slate-50 dark:bg-slate-950/50">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center px-8 sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            {navItems.find(
              (i) =>
                i.href === pathname ||
                (i.href !== "/volunteer" &&
                  pathname.startsWith(i.href + "/"))
            )?.label || "Dashboard"}
          </h2>
        </header>
        <div className="p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
