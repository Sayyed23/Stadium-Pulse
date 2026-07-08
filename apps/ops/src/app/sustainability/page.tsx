import React from 'react';
import { prisma } from '@stadiumpulse/db';
import { Trash2, Car, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SustainabilityPage() {
  // Query database using Prisma (RSC - Efficiency optimization)
  const wasteBins = await prisma.wasteBin.findMany({
    include: {
      zone: true
    }
  });

  const transportZones = await prisma.transportZone.findMany({});

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sustainability & Transport HUD</h1>
          <p className="text-xs text-slate-400">Monitoring waste-bin capacity and parking zone telemetry counts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Waste bins fill grid (FR-4.2) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-emerald-400" />
            Waste Bin Capacity Fill Monitors
          </h2>
          <div className="space-y-3">
            {wasteBins.map((bin) => (
              <div key={bin.id} className="bg-slate-950/40 border border-slate-900 rounded-lg p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-200 capitalize">Bin ID: {bin.id.replace('_', ' ')}</p>
                  <span className="text-[10px] text-slate-500 font-medium capitalize">Zone: {bin.zone.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${bin.fillPct >= 0.85 ? 'bg-rose-500 animate-pulse' : 'bg-indigo-500'}`} 
                      style={{ width: `${bin.fillPct * 100}%` }}
                    />
                  </div>
                  <span className={`font-mono font-bold ${bin.fillPct >= 0.85 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {Math.round(bin.fillPct * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transport Lot Capacity status cards (FR-4.1) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-1.5">
            <Car className="w-4 h-4 text-emerald-400" />
            Parking Zone Telemetry
          </h2>
          <div className="space-y-3">
            {transportZones.map((lot) => {
              const pct = lot.currentCount / lot.capacity;
              return (
                <div key={lot.id} className="bg-slate-950/40 border border-slate-900 rounded-lg p-3.5 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200 capitalize">{lot.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      pct >= 0.85 ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {Math.round(pct * 100)}% Full
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${pct >= 0.85 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${pct * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{lot.currentCount} vehicles</span>
                      <span>/ {lot.capacity} max</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
