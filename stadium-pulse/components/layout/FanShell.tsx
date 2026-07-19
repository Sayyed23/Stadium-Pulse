"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Navigation,
  Map as MapIcon,
  Utensils,
  Users,
  Bus,
  Accessibility,
  Bell,
  ShieldAlert,
  Settings,
  UserCircle2,
} from "lucide-react";

export function FanShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const primaryNavItems = [
    { href: "/fan", label: "Home", icon: LayoutDashboard },
    { href: "/fan/assistant", label: "AI Copilot", icon: MessageSquare },
    { href: "/fan/navigation", label: "Navigate", icon: Navigation },
    { href: "/fan/map", label: "Map", icon: MapIcon },
    { href: "/fan/amenities", label: "Amenities", icon: Utensils },
    { href: "/fan/crowd", label: "Crowd", icon: Users },
    { href: "/fan/transport", label: "Transport", icon: Bus },
    { href: "/fan/accessibility", label: "Access", icon: Accessibility },
    { href: "/fan/emergency", label: "SOS", icon: ShieldAlert },
    { href: "/fan/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#101415] text-[#e0e3e5] font-sans antialiased">
      {/* Top Header Shell */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 border-b border-[#3a494b]/40 bg-[#101415]/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,255,0.05)]">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] font-bold text-xs font-mono shadow-[0_0_10px_rgba(0,242,255,0.2)]">
              SP
            </div>
            <span className="font-bold tracking-tight text-lg text-white font-sans">
              StadiumPulse <span className="text-[#00f2ff] text-xs font-mono">FAN</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-4" aria-label="Fan portal navigation">
            {primaryNavItems.slice(0, 7).map((item) => {
              const isActive = pathname === item.href || (item.href !== "/fan" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#00f2ff] ${
                    isActive
                      ? "bg-[#00f2ff]/15 text-[#00f2ff] border border-[#00f2ff]/40 shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                      : "text-[#b9cacb] hover:text-white hover:bg-[#1d2022]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Quick Shortcuts */}
          <div className="hidden md:flex items-center gap-2 mr-2">
            <Link
              href="/fan/emergency"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-mono font-bold hover:bg-red-500/20 transition-all focus-visible:ring-2 focus-visible:ring-[#00f2ff]"
              aria-label="Emergency SOS"
            >
              <ShieldAlert size={15} />
              <span>SOS</span>
            </Link>
            <Link
              href="/fan/settings"
              className="p-2 rounded-xl text-[#b9cacb] hover:text-[#00f2ff] hover:bg-[#1d2022] transition-colors focus-visible:ring-2 focus-visible:ring-[#00f2ff]"
              title="Settings"
              aria-label="Settings"
            >
              <Settings size={18} />
            </Link>
          </div>

          <Link
            href="/fan/notifications"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1d2022] border border-[#3a494b]/40 text-[#b9cacb] hover:text-[#00f2ff] hover:border-[#00f2ff]/30 transition-all relative focus-visible:ring-2 focus-visible:ring-[#00f2ff]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#00f2ff] shadow-[0_0_6px_#00f2ff]" />
          </Link>
          <Link
            href="/profile"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1d2022] border border-[#3a494b]/40 text-[#b9cacb] hover:text-[#00f2ff] hover:border-[#00f2ff]/30 transition-all focus-visible:ring-2 focus-visible:ring-[#00f2ff]"
            aria-label="User profile"
          >
            <UserCircle2 className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-12 animate-fade-in relative z-10">
        {children}
      </main>

      {/* Mobile Floating Bottom Navigation Dock (Hidden on md+ desktop screens) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-40 md:hidden">
        <nav className="bg-[#1d2022]/95 backdrop-blur-xl border border-[#00f2ff]/30 rounded-2xl flex items-center justify-around h-16 px-2 shadow-[0_0_25px_rgba(0,0,0,0.8)]" aria-label="Fan mobile navigation">
          {primaryNavItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/fan" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-[#00f2ff] ${
                  isActive ? "text-[#00f2ff] font-bold" : "text-[#b9cacb] hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={`p-1 rounded-lg ${isActive ? "bg-[#00f2ff]/10" : ""}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
