"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-md p-8 bg-[#1d2022] rounded-3xl shadow-2xl border border-[#00f2ff]/30 space-y-6 text-center font-sans">
      <div className="flex items-center justify-between">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
          <ArrowLeft size={14} /> Back to Login
        </Link>
        <span className="text-[10px] font-mono text-[#b9cacb]">PASSWORD RECOVERY</span>
      </div>

      <div className="inline-flex w-12 h-12 rounded-2xl bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 items-center justify-center mb-1">
        <KeyRound size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Recover Credentials</h2>
        <p className="text-xs text-[#b9cacb] font-mono mt-1">Enter your staff email to dispatch reset token</p>
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="relative text-left">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#00f2ff]" />
            <input
              type="email"
              required
              className="w-full bg-[#101415] border border-[#3a494b] text-[#e0e3e5] placeholder:text-[#b9cacb]/60 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00f2ff]"
              placeholder="commander@stadiumpulse.ai"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] text-xs font-mono uppercase"
          >
            Send Reset Instructions <ArrowRight size={16} />
          </button>
        </form>
      ) : (
        <div className="bg-[#5cf968]/10 border border-[#5cf968]/30 p-4 rounded-2xl text-[#5cf968] text-xs font-mono font-bold">
          Reset instructions & auth token dispatched to your email.
        </div>
      )}

      <div>
        <Link href="/login" className="text-xs font-mono text-[#b9cacb] hover:text-[#00f2ff] inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Return to Login
        </Link>
      </div>
    </div>
  );
}
