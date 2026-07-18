"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowRight, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-center">
      <div className="inline-flex w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 items-center justify-center mb-2">
        <KeyRound size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Forgot Password</h2>
        <p className="text-xs text-zinc-400 mt-1">Enter your registered email address to receive password reset instructions</p>
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
          <div className="relative text-left">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="email"
              required
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="name@stadiumpulse.ai"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Send Reset Link <ArrowRight size={16} />
          </button>
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 text-sm">
          Reset link has been sent to your email. Check your inbox.
        </div>
      )}

      <div>
        <Link href="/login" className="text-xs text-zinc-400 hover:text-zinc-200">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}
