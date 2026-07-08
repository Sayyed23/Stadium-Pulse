'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation, MessageSquare, ArrowLeft, Clock } from 'lucide-react';
import { useSettings } from '../../../../context/SettingsContext';

const ZONE_MAP_COORDS: Record<string, { cx: number; cy: number; label: string }> = {
  'zone_gate2': { cx: 100, cy: 300, label: 'Gate 2' },
  'zone_concourse_a': { cx: 220, cy: 200, label: 'Concourse A' },
  'zone_restroom_3': { cx: 200, cy: 400, label: 'Restroom 3 Zone' },
  'zone_c': { cx: 350, cy: 300, label: 'Zone C (Concourse)' },
  'zone_a': { cx: 380, cy: 120, label: 'Zone A (North Stand)' },
  'zone_b': { cx: 380, cy: 480, label: 'Zone B (South Stand)' },
  'zone_d': { cx: 500, cy: 300, label: 'Zone D (VIP Boxes)' },
  'zone_gate7': { cx: 620, cy: 300, label: 'Gate 7 (Overflow)' },
};

export default function RouteHighlightPage({ params }: { params: { routeId: string } }) {
  const { highContrast } = useSettings();
  const [route, setRoute] = useState<string[]>([]);
  const [walkTime, setWalkTime] = useState<number>(0);

  useEffect(() => {
    const savedRoute = localStorage.getItem('active_calculated_route');
    const savedTime = localStorage.getItem('active_calculated_walk_time');
    
    if (savedRoute) {
      setRoute(JSON.parse(savedRoute));
    } else {
      // Default fallback route for demo
      setRoute(['zone_gate2', 'zone_concourse_a', 'zone_restroom_3']);
    }

    if (savedTime) {
      setWalkTime(Number(savedTime));
    } else {
      setWalkTime(7);
    }
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6 max-w-md mx-auto space-y-4">
      
      {/* Header with back actions */}
      <div className="flex items-center justify-between">
        <Link href="/assistant" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Chat
        </Link>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
          Calculated Path
        </span>
      </div>

      {/* SVG map with highlighted route */}
      <div className={`relative bg-slate-900 border rounded-xl p-2 min-h-[350px] flex items-center justify-center overflow-hidden shadow-2xl ${
        highContrast ? 'border-white' : 'border-slate-800'
      }`}>
        <svg className="w-full h-full max-w-[400px] max-h-[380px]" viewBox="0 0 700 600">
          {/* Static Walkways grid */}
          {Object.keys(ZONE_MAP_COORDS).map((key) => {
            const start = ZONE_MAP_COORDS[key];
            return (
              <g key={`links-${key}`}>
                {key === 'zone_gate2' && (
                  <>
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_concourse_a'].cx} y2={ZONE_MAP_COORDS['zone_concourse_a'].cy} stroke="#1e293b" strokeWidth="4" />
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_c'].cx} y2={ZONE_MAP_COORDS['zone_c'].cy} stroke="#1e293b" strokeWidth="4" />
                  </>
                )}
                {key === 'zone_concourse_a' && (
                  <>
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_restroom_3'].cx} y2={ZONE_MAP_COORDS['zone_restroom_3'].cy} stroke="#1e293b" strokeWidth="4" />
                    <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_a'].cx} y2={ZONE_MAP_COORDS['zone_a'].cy} stroke="#1e293b" strokeWidth="4" />
                  </>
                )}
                {key === 'zone_restroom_3' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_c'].cx} y2={ZONE_MAP_COORDS['zone_c'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_c' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_d'].cx} y2={ZONE_MAP_COORDS['zone_d'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_a' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_b'].cx} y2={ZONE_MAP_COORDS['zone_b'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_b' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_d'].cx} y2={ZONE_MAP_COORDS['zone_d'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
                {key === 'zone_d' && (
                  <line x1={start.cx} y1={start.cy} x2={ZONE_MAP_COORDS['zone_gate7'].cx} y2={ZONE_MAP_COORDS['zone_gate7'].cy} stroke="#1e293b" strokeWidth="4" />
                )}
              </g>
            );
          })}

          {/* Highlight active routing paths */}
          {route.length > 1 && route.map((zone, idx) => {
            if (idx === route.length - 1) return null;
            const start = ZONE_MAP_COORDS[zone];
            const end = ZONE_MAP_COORDS[route[idx + 1]];
            if (!start || !end) return null;
            return (
              <line 
                key={`active-line-${idx}`}
                x1={start.cx} 
                y1={start.cy} 
                x2={end.cx} 
                y2={end.cy} 
                stroke="#10b981" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="animate-pulse"
              />
            );
          })}

          {/* Zones */}
          {Object.keys(ZONE_MAP_COORDS).map((key) => {
            const zone = ZONE_MAP_COORDS[key];
            const isRouting = route.includes(key);
            const isCurrent = route[0] === key;
            const isTarget = route[route.length - 1] === key;

            return (
              <g key={`node-${key}`}>
                <circle 
                  cx={zone.cx} 
                  cy={zone.cy} 
                  r={isCurrent || isTarget ? '18' : '14'} 
                  fill={isCurrent ? '#10b981' : isTarget ? '#ef4444' : isRouting ? '#059669' : '#0f172a'} 
                  stroke={isRouting ? '#10b981' : '#334155'}
                  strokeWidth="2" 
                />
                <text x={zone.cx} y={zone.cy + 28} textAnchor="middle" fill="#94a3b8" fontSize="9px" fontWeight="bold">
                  {zone.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Walk Time Display */}
        <div className="absolute top-2 right-2 bg-slate-950/95 border border-emerald-500/30 px-3 py-1.5 rounded flex items-center gap-1.5 shadow-lg">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-100">{walkTime} min walk</span>
        </div>
      </div>

      {/* CTA bottom details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
        <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
          <Navigation className="w-4 h-4 text-indigo-400" />
          Turn-by-turn Navigation Guidance
        </h3>
        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside pl-1 font-medium">
          {route.map((r, idx) => (
            <li key={r} className="capitalize">
              {idx === 0 ? 'Start at' : idx === route.length - 1 ? 'Arrive at destination:' : 'Transition through'}{' '}
              <strong className="text-slate-200">{ZONE_MAP_COORDS[r]?.label || r}</strong>
            </li>
          ))}
        </ol>
        <Link 
          href="/assistant" 
          className="mt-2 w-full bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-bold py-2 rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition"
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          Ask a follow-up question
        </Link>
      </div>

    </div>
  );
}
