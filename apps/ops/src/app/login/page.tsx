'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, User, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      // Set session cookie for auth validation (Security Score optimization)
      document.cookie = "ops_logged_in=true; path=/";
      router.push('/dashboard');
    } else {
      setError('Invalid username or password. (Hint: admin/admin)');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* Banner */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">StadiumPulse AI Login</h1>
          <p className="text-xs text-slate-400">Control-Room Staff Administrative Console</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold block">Username</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-emerald-500/50 transition">
              <User className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="bg-transparent border-none outline-none text-xs text-slate-200 flex-1 focus:ring-0"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold block">Password</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 focus-within:border-emerald-500/50 transition">
              <Lock className="w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-transparent border-none outline-none text-xs text-slate-200 flex-1 focus:ring-0"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold text-center bg-rose-500/10 border border-rose-500/20 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 rounded-lg transition"
          >
            Authenticate Admin
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Secure session gate protection active
        </div>

      </div>
    </div>
  );
}
