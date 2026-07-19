"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Lock, Mail, Smartphone } from "lucide-react";

export default function UnifiedLoginPage() {
  const [portal, setPortal] = useState<"fan" | "volunteer" | "ops" | "admin">("fan");
  const [identity, setIdentity] = useState("");
  const [passcode, setPasscode] = useState("");

  return (
    <div className="w-full max-w-md p-8 bg-[#1d2022] rounded-3xl shadow-2xl border border-[#00f2ff]/30 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <span className="text-[10px] font-mono text-[#b9cacb]">SECURE AUTH</span>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-[#00f2ff]/10 border border-[#00f2ff]/40 items-center justify-center text-[#00f2ff] font-bold text-sm font-mono glow-cyan-sm mb-1">
          SP
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Secure Portal Access</h2>
        <p className="text-xs text-[#b9cacb] font-mono">Select role to authenticate into StadiumPulse AI</p>
      </div>

      {/* Role Selector */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#101415] border border-[#3a494b]/40 rounded-xl text-xs font-mono font-bold">
        {(["fan", "volunteer", "ops", "admin"] as const).map((p) => (
          <button type="button"
            key={p}
            onClick={() => setPortal(p)}
            className={`py-2.5 rounded-lg capitalize transition-all ${
              portal === p
                ? "bg-[#00f2ff] text-[#00363a] shadow-lg"
                : "text-[#b9cacb] hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider mb-1 text-[#b9cacb]">
            {portal === "fan" ? "Mobile Number" : "Staff Email / Username"}
          </label>
          <div className="relative">
            {portal === "fan" ? <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f2ff]" /> : <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f2ff]" />}
            <input
              type={portal === "fan" ? "tel" : "text"}
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              className="w-full bg-[#101415] border border-[#3a494b] text-[#e0e3e5] placeholder:text-[#b9cacb]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00f2ff]"
              placeholder={portal === "fan" ? "+91 98765 43210" : "commander@stadiumpulse.ai"}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#b9cacb]">Passcode / Auth Token</label>
            <Link href="/forgot-password" className="text-[11px] font-mono text-[#00f2ff] hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f2ff]" />
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-[#101415] border border-[#3a494b] text-[#e0e3e5] placeholder:text-[#b9cacb]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00f2ff]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Link
          href={portal === "fan" ? "/fan" : portal === "volunteer" ? "/volunteer" : portal === "ops" ? "/ops/dashboard" : "/admin"}
          className="w-full bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] mt-2 text-xs font-mono uppercase"
        >
          Authenticate to {portal.toUpperCase()} <ArrowRight size={16} />
        </Link>
      </form>

      <div className="text-center">
        <Link href="/verify" className="text-xs font-mono text-[#b9cacb] hover:text-[#00f2ff]">
          Have an OTP code? Verify session token →
        </Link>
      </div>
    </div>
  );
}
