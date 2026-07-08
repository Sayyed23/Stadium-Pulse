import React from 'react';
import { prisma } from '@stadiumpulse/db';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Map, 
  Settings, 
  AlertCircle, 
  ShieldAlert, 
  Activity, 
  Sparkles,
  Users
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ZoneDetailPage({ params }: { params: { zoneId: string } }) {
  // Fetch details using Prisma (RSC - Efficiency optimization)
  const zone = await prisma.zone.findUnique({
    where: { id: params.zoneId },
    include: {
      amenities: true,
      alertLogs: {
        orderBy: { timestamp: 'desc' }
      },
      volunteers: true
    }
  });

  if (!zone) {
    return (
      <div className="p-6 text-center text-slate-500">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500 animate-bounce" />
        <p className="text-xs">Zone ID not found. Verify parameters and retry.</p>
        <Link href="/dashboard" className="mt-4 inline-block text-xs text-emerald-400 hover:underline">
          Back to Live Heatmaps
        </Link>
      </div>
    );
  }

  const capacityPct = zone.currentCount / zone.capacity;

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <Link href="/dashboard" className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Live Heatmaps
        </Link>
        <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          Zone ID: {zone.id}
        </span>
      </div>

      {/* Main Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Capacity details */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-1.5 capitalize">
            <Activity className="w-4 h-4 text-emerald-400" />
            {zone.name} Occupancy Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-3 border border-slate-900 rounded-lg">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Current Occupants</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                {zone.currentCount.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 border border-slate-900 rounded-lg">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Max Capacity</span>
              <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">
                {zone.capacity.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Heat Fill Rate</span>
              <span>{Math.round(capacityPct * 100)}% filled</span>
            </div>
            <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-slate-850">
              <div 
                className={`h-full ${
                  capacityPct >= 0.95 ? 'bg-rose-500' : capacityPct >= 0.85 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, capacityPct * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Assigned Staff */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            Assigned Staff
          </h2>
          <div className="space-y-2">
            {zone.volunteers.length === 0 ? (
              <p className="text-xs text-slate-500">No volunteers active in this zone.</p>
            ) : (
              zone.volunteers.map((vol) => (
                <div key={vol.id} className="bg-slate-950/40 border border-slate-900 p-2.5 rounded-lg text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">{vol.name}</p>
                    <span className="text-[9px] text-slate-500">Langs: {vol.preferredLanguage.toUpperCase()}</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full capitalize">
                    {vol.availability}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Grid: Amenities list & Alert logs history */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Amenities log card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300">Zone Points of Interest (Amenities)</h2>
          <div className="space-y-2.5">
            {zone.amenities.length === 0 ? (
              <p className="text-xs text-slate-500">No amenities registered inside this zone.</p>
            ) : (
              zone.amenities.map((amenity) => (
                <div key={amenity.id} className="bg-slate-950/40 border border-slate-900 p-3 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block capitalize">{amenity.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium capitalize">Type: {amenity.type}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    amenity.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {amenity.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts logs history */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Alert History Logs
          </h2>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {zone.alertLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No capacity alerts logged for this zone.</p>
            ) : (
              zone.alertLogs.map((alert) => (
                <div key={alert.id} className="bg-slate-950/40 border border-slate-900 p-3 rounded-lg text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      alert.thresholdCrossed === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {alert.thresholdCrossed}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 font-medium">{alert.generatedSummary}</p>
                  <div className="bg-slate-900/50 p-1.5 rounded text-[10px] text-slate-400 border border-slate-850/60">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px] block">AI Action Nudge</span>
                    {alert.recommendedAction}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
