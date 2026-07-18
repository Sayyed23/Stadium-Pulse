"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, User, Users, ShieldCheck, Shield, Globe, Sparkles } from "lucide-react";

export default function LandingPage() {
  const [selectedLang, setSelectedLang] = useState("EN");

  return (
    <main className="relative min-h-screen bg-[#101415] text-[#e0e3e5] font-sans overflow-x-hidden">
      {/* Background Stadium Glow */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-[85vh] bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101415]/60 via-[#101415]/80 to-[#101415]" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#101415]/80 backdrop-blur-xl border-b border-[#3a494b]/30">
        <div className="flex justify-between items-center w-full px-6 max-w-7xl mx-auto py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/40 flex items-center justify-center text-[#00f2ff] font-bold text-sm font-mono glow-cyan-sm">
              SP
            </div>
            <span className="font-bold text-xl text-[#00f2ff] tracking-tight">StadiumPulse AI</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1d2022] border border-[#3a494b]/50 text-xs">
              <Globe className="w-4 h-4 text-[#00f2ff]" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-[#e0e3e5] focus:outline-none cursor-pointer"
              >
                <option value="EN" className="bg-[#101415]">EN - English</option>
                <option value="HI" className="bg-[#101415]">HI - हिन्दी</option>
                <option value="ES" className="bg-[#101415]">ES - Español</option>
                <option value="FR" className="bg-[#101415]">FR - Français</option>
              </select>
            </div>

            <Link href="/login" className="px-4 py-2 rounded-xl bg-[#00f2ff] text-[#00363a] font-bold text-xs hover:bg-[#74f5ff] transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]">
              Staff Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00dbe7] text-xs font-mono tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Stadium Intelligence</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              AI-Powered Smart <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2ff] via-[#74f5ff] to-[#5cf968]">
                Stadium Experience
              </span>
            </h1>

            <p className="text-lg text-[#b9cacb] max-w-xl leading-relaxed">
              Real-time turn-by-turn navigation, live crowd telemetry, emergency SOS dispatch, and AI copilot insights for FIFA World Cup 2026™.
            </p>

            {/* Main Portal Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <Link
                href="/fan"
                className="group p-4 rounded-2xl bg-[#1d2022] border border-[#00f2ff]/30 hover:border-[#00f2ff] transition-all flex flex-col items-start gap-2 hover:scale-[1.03]"
              >
                <div className="p-2.5 rounded-xl bg-[#00f2ff]/10 text-[#00f2ff]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-[#00f2ff] transition-colors">Fan Experience</div>
                  <div className="text-[11px] text-[#b9cacb]">Map & AI Assistant</div>
                </div>
              </Link>

              <Link
                href="/volunteer"
                className="group p-4 rounded-2xl bg-[#1d2022] border border-[#5cf968]/30 hover:border-[#5cf968] transition-all flex flex-col items-start gap-2 hover:scale-[1.03]"
              >
                <div className="p-2.5 rounded-xl bg-[#5cf968]/10 text-[#5cf968]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-[#5cf968] transition-colors">Volunteer Portal</div>
                  <div className="text-[11px] text-[#b9cacb]">Tasks & Copilot</div>
                </div>
              </Link>

              <Link
                href="/ops/dashboard"
                className="group p-4 rounded-2xl bg-[#1d2022] border border-blue-500/30 hover:border-blue-400 transition-all flex flex-col items-start gap-2 hover:scale-[1.03]"
              >
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">Control Room</div>
                  <div className="text-[11px] text-[#b9cacb]">Live Ops Telemetry</div>
                </div>
              </Link>

              <Link
                href="/admin"
                className="group p-4 rounded-2xl bg-[#1d2022] border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col items-start gap-2 hover:scale-[1.03]"
              >
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">Admin Portal</div>
                  <div className="text-[11px] text-[#b9cacb]">Venue & AI Config</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Cards / Event Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#1d2022]/80 backdrop-blur-xl border border-[#3a494b]/50 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-[#5cf968] text-xs font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#5cf968] animate-ping" />
                  LIVE EVENT ACTIVE
                </div>
                <span className="text-xs text-[#b9cacb]">100,000+ Capacity</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">FIFA World Cup Finals 2026</h3>
                <p className="text-xs text-[#b9cacb] mt-1">Azteca Stadium · Sector A, B, C & D Active</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#272a2c] border border-[#3a494b]/30 text-xs">
                  <span className="text-[#b9cacb] block text-[10px]">AVG NAV TIME</span>
                  <span className="text-[#00f2ff] font-bold text-base font-mono">4.2 Mins</span>
                </div>
                <div className="p-3 rounded-xl bg-[#272a2c] border border-[#3a494b]/30 text-xs">
                  <span className="text-[#b9cacb] block text-[10px]">INCIDENT COPILOT</span>
                  <span className="text-[#5cf968] font-bold text-base font-mono">98.4% Resolv</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/fan" className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00f2ff] text-[#00363a] font-bold text-sm hover:bg-[#74f5ff] transition-all">
                  Launch Fan App <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#3a494b]/30 py-8 text-center text-xs text-[#b9cacb] flex flex-wrap justify-center gap-6">
        <Link href="/about" className="hover:text-[#00f2ff] transition-colors">About</Link>
        <Link href="/faq" className="hover:text-[#00f2ff] transition-colors">FAQ</Link>
        <Link href="/help" className="hover:text-[#00f2ff] transition-colors">Help Center</Link>
        <Link href="/privacy" className="hover:text-[#00f2ff] transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-[#00f2ff] transition-colors">Terms of Service</Link>
        <Link href="/contact" className="hover:text-[#00f2ff] transition-colors">Contact Support</Link>
      </footer>
    </main>
  );
}
