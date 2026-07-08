'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Accessibility, WifiOff, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function HeaderWrapper() {
  const { highContrast } = useSettings();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <header className={`p-4 flex items-center justify-between z-50 border-b ${
      highContrast ? 'border-white bg-black' : 'border-slate-800 bg-slate-900/60'
    } backdrop-blur-md sticky top-0`}>
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-emerald-500 animate-pulse" />
        <Link href="/" className="font-bold text-sm md:text-base tracking-wider uppercase">
          StadiumPulse <span className="text-emerald-400">Fan PWA</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {!isOnline && (
          <Link href="/offline" className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-xs font-semibold">
            <WifiOff className="w-3.5 h-3.5" />
            Offline Mode
          </Link>
        )}
        <Link 
          href="/accessibility" 
          className={`p-1.5 border rounded-lg transition hover:scale-105 ${
            highContrast ? 'border-white hover:bg-white hover:text-black' : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
          }`}
          aria-label="Open accessibility settings panel"
        >
          <Accessibility className="w-4.5 h-4.5" />
        </Link>
      </div>
    </header>
  );
}
