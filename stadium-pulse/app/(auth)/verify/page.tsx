"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, val: string) => {
    if (val.length <= 1) {
      const copy = [...otp];
      copy[index] = val;
      setOtp(copy);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-[#1d2022] rounded-3xl shadow-2xl border border-[#00f2ff]/30 space-y-6 text-center font-sans">
      <div className="flex items-center justify-between">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
          <ArrowLeft size={14} /> Back to Login
        </Link>
        <span className="text-[10px] font-mono text-[#b9cacb]">2FA VERIFICATION</span>
      </div>

      <div className="inline-flex w-12 h-12 rounded-2xl bg-[#5cf968]/10 text-[#5cf968] border border-[#5cf968]/30 items-center justify-center mb-1">
        <ShieldCheck size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">OTP Verification</h2>
        <p className="text-xs text-[#b9cacb] font-mono mt-1">Enter 6-digit verification code sent to your phone</p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#101415] border border-[#3a494b] text-white rounded-xl focus:outline-none focus:border-[#00f2ff]"
          />
        ))}
      </div>

      <Link
        href="/fan"
        className="w-full bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] text-xs font-mono uppercase"
      >
        Verify Session Code <ArrowRight size={16} />
      </Link>

      <p className="text-xs text-[#b9cacb] font-mono">
        Didn&apos;t receive code? <button type="button" className="text-[#00f2ff] font-bold hover:underline">Resend OTP</button>
      </p>
    </div>
  );
}
