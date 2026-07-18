"use client";

import Link from "next/link";
import {
  Brain,
  Mic,
  Navigation,
  Map as MapIcon,
  Users,
  Utensils,
  Car,
  Accessibility,
  Calendar,
  ShieldAlert,
  Sparkles,
  DoorOpen,
  ArrowRight,
} from "lucide-react";

export default function FanExperiencePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 font-sans space-y-6">
      {/* Welcome Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to Azteca Stadium
          </h1>
          <p className="text-xs sm:text-sm text-[#b9cacb] mt-1 font-mono">Enjoy the FIFA World Cup Finals — Live Telemetry & Fan Services</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-xs font-mono font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
            LIVE: FIFA WORLD CUP FINALS
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] font-bold text-xs font-mono shadow-md shrink-0">
            FWC
          </div>
        </div>
      </section>

      {/* Main Grid: 12 Cols on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Primary Column (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero AI Search Bar */}
          <section className="space-y-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl group-focus-within:bg-[#00f2ff]/35 transition-all rounded-2xl" />
              <div className="relative flex items-center bg-[#1d2022] border border-[#00f2ff]/40 rounded-2xl px-4 py-4 shadow-xl">
                <Brain className="text-[#00f2ff] mr-3 shrink-0" size={22} />
                <input
                  type="text"
                  placeholder="Ask anything... (e.g. 'Where is the nearest medical desk?' or 'Fastest way to Gate 4')"
                  className="bg-transparent border-none focus:outline-none text-[#e0e3e5] placeholder:text-[#b9cacb]/60 w-full text-xs sm:text-sm"
                />
                <button className="ml-2 text-[#00f2ff] p-2 hover:bg-[#00f2ff]/10 rounded-xl transition-colors shrink-0">
                  <Mic size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["Find My Seat", "Food Near Me", "Nearest Restroom", "Parking Telemetry"].map((chip) => (
                <Link
                  key={chip}
                  href="/fan/assistant"
                  className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#1d2022] border border-[#3a494b]/40 text-xs font-semibold text-[#e0e3e5] hover:text-[#00f2ff] hover:border-[#00f2ff]/40 transition-colors shadow-md"
                >
                  {chip}
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="space-y-3">
            <h2 className="text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider">Fan Portal Services</h2>
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {[
                { href: "/fan/navigation", label: "Navigate", icon: Navigation, color: "text-[#00f2ff]" },
                { href: "/fan/map", label: "Map", icon: MapIcon, color: "text-[#00f2ff]" },
                { href: "/fan/crowd", label: "Crowd", icon: Users, color: "text-[#00f2ff]" },
                { href: "/fan/amenities", label: "Food", icon: Utensils, color: "text-[#00f2ff]" },
                { href: "/fan/transport", label: "Parking", icon: Car, color: "text-[#00f2ff]" },
                { href: "/fan/accessibility", label: "Access", icon: Accessibility, color: "text-[#00f2ff]" },
                { href: "/fan/settings", label: "Schedule", icon: Calendar, color: "text-[#00f2ff]" },
                { href: "/fan/emergency", label: "Emergency", icon: ShieldAlert, color: "text-red-400" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="bg-[#1d2022] border border-[#3a494b]/40 p-3.5 rounded-2xl flex flex-col items-center gap-2 transition-all hover:border-[#00f2ff]/50 hover:scale-105 active:scale-95 group text-center shadow-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] group-hover:bg-[#00f2ff]/20 transition-colors">
                      <Icon size={20} className={item.color} />
                    </div>
                    <span className="text-xs font-bold text-white leading-tight">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* AI Insights & Recommendations */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#00f2ff]" size={18} />
              <h2 className="text-sm font-mono font-bold text-[#00f2ff] uppercase tracking-wider">AI Live Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1d2022] p-4 rounded-2xl flex items-start gap-4 border border-[#00f2ff]/20 shadow-xl">
                <Navigation className="text-[#00f2ff] mt-0.5 shrink-0" size={22} />
                <div>
                  <h3 className="font-bold text-white text-sm">Fastest route to your seat</h3>
                  <p className="text-[#b9cacb] text-xs mt-1 leading-relaxed">
                    Take the North Elevator to bypass the heavy Gate 1 congestion. Estimated 4 min walk.
                  </p>
                </div>
              </div>
              <div className="bg-[#1d2022] p-4 rounded-2xl flex items-start gap-4 border border-[#00f2ff]/20 shadow-xl">
                <DoorOpen className="text-[#00f2ff] mt-0.5 shrink-0" size={22} />
                <div>
                  <h3 className="font-bold text-white text-sm">Less crowded Gate 2</h3>
                  <p className="text-[#b9cacb] text-xs mt-1 leading-relaxed">
                    Entry speed at Gate 2 is currently 40% faster than your assigned gate entry queue.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Secondary Column (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Seat Map Preview Card */}
          <section className="bg-[#1d2022] rounded-2xl overflow-hidden h-52 relative shadow-2xl border border-[#00f2ff]/30 flex flex-col justify-between p-5">
            <div className="absolute inset-0 bg-[radial-gradient(#00f2ff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
            <div className="relative z-10 space-y-1">
              <span className="px-2.5 py-1 bg-[#00f2ff] text-[#00363a] font-mono text-[10px] font-extrabold rounded uppercase tracking-wider">
                Level 3 • Section 214
              </span>
              <h3 className="font-extrabold text-white text-lg mt-2">Your Seat: Row K-12</h3>
              <p className="text-xs text-[#b9cacb] font-mono">Gate Access: North Concourse Gate 12</p>
            </div>
            <div className="relative z-10 flex items-center justify-between border-t border-[#3a494b]/30 pt-3">
              <span className="text-xs font-mono text-[#5cf968] font-bold">STATUS: CONFIRMED</span>
              <Link
                href="/fan/navigation"
                className="flex items-center gap-1.5 bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(0,242,255,0.3)]"
              >
                View Route <ArrowRight size={14} />
              </Link>
            </div>
          </section>

          {/* Live Stadium Telemetry Grid */}
          <section className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 space-y-3 shadow-xl">
            <h3 className="font-mono font-bold text-xs text-[#00f2ff] uppercase tracking-wider">Stadium Telemetry</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40 border-l-4 border-l-[#00f2ff]">
                <span className="text-[10px] font-mono uppercase text-[#b9cacb]">Crowd Density</span>
                <span className="block font-mono text-2xl font-extrabold text-[#00f2ff] mt-0.5">84%</span>
              </div>
              <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                <span className="text-[10px] font-mono uppercase text-[#b9cacb]">Temperature</span>
                <span className="block font-mono text-2xl font-extrabold text-[#e0e3e5] mt-0.5">24°C</span>
              </div>
              <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                <span className="text-[10px] font-mono uppercase text-[#b9cacb]">Parking P4</span>
                <span className="block font-mono text-2xl font-extrabold text-red-400 mt-0.5">FULL</span>
              </div>
              <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                <span className="text-[10px] font-mono uppercase text-[#b9cacb]">Next Shuttle</span>
                <span className="block font-mono text-2xl font-extrabold text-[#5cf968] mt-0.5">5 min</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
