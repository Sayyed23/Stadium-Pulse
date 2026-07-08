'use client';

import React from 'react';
import { WifiOff, PhoneCall, ShieldAlert, FileText } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function OfflinePage() {
  const { highContrast } = useSettings();

  return (
    <div className="flex-1 p-5 max-w-md mx-auto space-y-5 text-center">
      
      {/* Icon */}
      <div className="py-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 text-rose-400 animate-pulse">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold mt-4 tracking-tight">Offline Mode Active</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">
          You are currently disconnected. The cached map and emergency contacts remain active.
        </p>
      </div>

      {/* Offline contacts card */}
      <div className={`p-5 rounded-xl border text-left space-y-4 ${
        highContrast ? 'bg-black border-white' : 'bg-slate-900/50 border-slate-800'
      }`}>
        <h2 className="text-sm font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          Emergency Support Hotlines
        </h2>
        <div className="space-y-3 text-xs font-semibold">
          <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-900 rounded">
            <span className="text-slate-400">Security Command Desk:</span>
            <a href="tel:+15550199" className="text-emerald-400 font-mono hover:underline">+1 (555) 0199</a>
          </div>
          <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-900 rounded">
            <span className="text-slate-400">Medical Operations Room:</span>
            <a href="tel:+15550255" className="text-emerald-400 font-mono hover:underline">+1 (555) 0255</a>
          </div>
        </div>
      </div>

      {/* Static cached map block */}
      <div className={`p-5 rounded-xl border text-left space-y-3 ${
        highContrast ? 'bg-black border-white' : 'bg-slate-900/50 border-slate-800 text-slate-400'
      }`}>
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          Offline Safety Map Guidelines
        </h2>
        <ul className="text-xs space-y-2 list-disc list-inside font-medium leading-relaxed">
          <li><strong>Gate 2 (West Stand)</strong>: Primary handicap exit path.</li>
          <li><strong>Zone A (North Stand)</strong>: Houses first aid station 1.</li>
          <li><strong>Zone C (East concourse)</strong>: Elevator links to Box seating.</li>
        </ul>
      </div>

    </div>
  );
}
