"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-center">
      <div className="inline-flex w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 items-center justify-center mb-2">
        <ShieldCheck size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">OTP Verification</h2>
        <p className="text-xs text-zinc-400 mt-1">Enter the 6-digit verification code sent to your phone</p>
      </div>

      <div className="flex justify-center gap-2">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-11 h-12 text-center text-lg font-bold bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        ))}
      </div>

      <Link
        href="/fan"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        Verify Code <ArrowRight size={16} />
      </Link>

      <p className="text-xs text-zinc-400">
        Didn&apos;t receive code? <button className="text-emerald-500 font-semibold hover:underline">Resend OTP</button>
      </p>
    </div>
  );
}
