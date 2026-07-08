'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Map, Car, Globe, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function FanHomePage() {
  const { highContrast } = useSettings();

  const cards = [
    {
      title: 'Ask AI Assistant',
      desc: 'Free-text and voice navigation in Hindi, Marathi, and English.',
      href: '/assistant',
      icon: MessageSquare,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50'
    },
    {
      title: 'Stadium Map',
      desc: 'High-contrast SVG wayfinder map with filters for restrooms, lifts, exits.',
      href: '/map',
      icon: Map,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50'
    },
    {
      title: 'Transport Status',
      desc: 'Real-time parking capacity, shuttle arrivals, and route redirections.',
      href: '/transport',
      icon: Car,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50'
    },
    {
      title: 'Language Settings',
      desc: 'Toggle language translations and font sizing preferences.',
      href: '/accessibility',
      icon: Globe,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/50'
    }
  ];

  return (
    <div className="flex-1 p-5 max-w-md mx-auto space-y-6">
      
      {/* Hero Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col justify-between h-40 shadow-xl overflow-hidden relative ${
        highContrast ? 'bg-black border-white' : 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-slate-800'
      }`}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl animate-pulse"></div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Tournament Live
          </span>
          <h2 className="text-xl font-bold mt-3 tracking-tight">Stadium Pulse Arena</h2>
          <p className="text-xs text-slate-400 mt-1">FIFA World Cup 2026 Egress Support</p>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-slate-800/80 pt-3">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
            Gate 2 Entrance Active
          </span>
          <span className="text-slate-300 font-bold">14:52 IST</span>
        </div>
      </div>

      {/* Grid of 4 quick tiles */}
      <div className="grid grid-cols-1 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link 
              key={idx} 
              href={card.href}
              className={`p-4 rounded-xl border flex gap-4 transition-all group ${
                highContrast ? 'bg-black border-white hover:bg-white hover:text-black' : card.color
              }`}
            >
              <div className="shrink-0 mt-0.5">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm leading-none tracking-wide">{card.title}</h3>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition translate-x-[-4px] group-hover:translate-x-0" />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer / Safety Banner */}
      <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
        highContrast ? 'bg-black border-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
      }`}>
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <p className="font-medium">
          <strong>Fan Support Notice</strong>: Chat and maps are fully accessible offline. In case of emergency, find a volunteer or call the hotline immediately.
        </p>
      </div>

    </div>
  );
}
