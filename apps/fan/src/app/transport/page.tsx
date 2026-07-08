'use client';

import React from 'react';
import { Car, AlertTriangle, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function TransportPage() {
  const { highContrast } = useSettings();

  const lots = [
    { id: 'transport_lot_b', name: 'Parking Lot B (North Stand)', type: 'parking', count: 850, capacity: 1000, color: 'border-amber-500/40 text-amber-400 bg-amber-500/5' },
    { id: 'transport_lot_d', name: 'Parking Lot D (VIP/Overflow)', type: 'parking', count: 300, capacity: 1500, color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' }
  ];

  const recommendedLot = lots.find(l => (l.count / l.capacity) < 0.5);

  return (
    <div className="flex-1 p-5 max-w-md mx-auto space-y-5">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Car className="w-6 h-6 text-emerald-400" />
          Transport & Parking Status
        </h1>
        <p className="text-xs text-slate-400 mt-1">Live capacity of parking zones and shuttle lines.</p>
      </div>

      {/* Recommended banner */}
      {recommendedLot && (
        <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
          highContrast ? 'bg-black border-white text-white' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
        }`}>
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Recommended Parking Lot</strong>
            <p className="mt-1 font-medium">
              We recommend parking in <strong>{recommendedLot.name}</strong>. It is currently at {Math.round((recommendedLot.count / recommendedLot.capacity) * 100)}% capacity with short walking times to the gates.
            </p>
          </div>
        </div>
      )}

      {/* Warning/Nudge banner */}
      <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed bg-amber-950/25 border-amber-500/40 text-amber-300`}>
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Traffic Redirection Nudge</strong>
          <p className="mt-1 font-medium">
            Lot B is currently at 85% capacity. Staff are redirecting incoming traffic to Lot D to prevent exit gridlocks.
          </p>
        </div>
      </div>

      {/* Status Cards */}
      <div className="space-y-4">
        {lots.map((lot) => {
          const pct = lot.count / lot.capacity;
          return (
            <div 
              key={lot.id} 
              className={`p-4 rounded-xl border space-y-3 ${
                highContrast ? 'bg-black border-white text-white' : lot.color
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm tracking-wide">{lot.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-900 border border-slate-800">
                  {Math.round(pct * 100)}% filled
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="w-full bg-slate-950/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${pct >= 0.85 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${pct * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{lot.count} occupied</span>
                  <span>/ {lot.capacity} capacity</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
