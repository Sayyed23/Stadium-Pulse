'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Map, 
  Bell, 
  Sparkles, 
  Clock, 
  Check, 
  RefreshCw, 
  ShieldAlert, 
  Car, 
  Navigation 
} from 'lucide-react';

interface ZoneState {
  zone_id: string;
  current_count: number;
  capacity: number;
  pct: number;
}

interface AlertEvent {
  id: string;
  zone_id: string;
  threshold_crossed: string;
  generated_summary: string;
  recommended_action: string;
  timestamp: string;
  acknowledged?: boolean;
}

interface NudgeEvent {
  type: string;
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [zones, setZones] = useState<Record<string, ZoneState>>({});
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [nudges, setNudges] = useState<NudgeEvent[]>([]);

  // SSE telemetry stream
  useEffect(() => {
    let eventSource: EventSource;

    const connectSSE = () => {
      eventSource = new EventSource('/api/zones/stream');

      eventSource.addEventListener('zone_update', (e: any) => {
        const data = JSON.parse(e.data);
        setZones(prev => ({ ...prev, [data.zone_id]: data }));
      });

      eventSource.addEventListener('alert', (e: any) => {
        const data = JSON.parse(e.data);
        setAlerts(prev => [{ ...data, acknowledged: false }, ...prev]);
      });

      eventSource.addEventListener('sustainability_nudge', (e: any) => {
        const data = JSON.parse(e.data);
        setNudges(prev => [data, ...prev]);
      });

      eventSource.onerror = () => {
        eventSource.close();
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      eventSource.close();
    };
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      const res = await fetch('/api/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert_id: alertId,
          operator_id: 'op_meera_control'
        })
      });
      const data = await res.json();
      if (data.success) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
      }
    } catch (e) {
      console.error("Failed to acknowledge alert", e);
    }
  };

  const getCapacityColor = (pct: number) => {
    if (pct >= 0.95) return 'bg-rose-950/60 border-rose-500 text-rose-200';
    if (pct >= 0.85) return 'bg-amber-950/50 border-amber-500 text-amber-200';
    return 'bg-slate-900 border-slate-800 text-slate-200';
  };

  const getCapacityBadge = (pct: number) => {
    if (pct >= 0.95) return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
    if (pct >= 0.85) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  };

  return (
    <div className="p-6 space-y-6 flex-1 flex flex-col">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Live Operations Heatmap</h1>
          <p className="text-xs text-slate-400">Monitoring 8 stadium zones for surges and bottleneck alerts.</p>
        </div>
        <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Stream Connected
        </span>
      </div>

      {/* Main Grid: Heatmaps & Alert Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        
        {/* HEATMAP GRID */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Map className="w-4 h-4 text-emerald-400" />
            Arena Zone Heatmaps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(zones).length === 0 ? (
              <div className="col-span-3 text-center py-20 text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-700" />
                Connecting to live occupancy stream...
              </div>
            ) : (
              Object.values(zones).map((z) => (
                <Link
                  key={z.zone_id}
                  href={`/dashboard/zones/${z.zone_id}`}
                  className={`border rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-xl ${getCapacityColor(z.pct)}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm tracking-wide capitalize">
                      {z.zone_id.replace('zone_', '').replace('_', ' ')}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${getCapacityBadge(z.pct)}`}>
                      {Math.round(z.pct * 100)}% Full
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          z.pct >= 0.95 ? 'bg-rose-500' : z.pct >= 0.85 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, z.pct * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{z.current_count.toLocaleString()} count</span>
                      <span>/ {z.capacity.toLocaleString()} cap</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* ALERTS FEED */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-4 flex flex-col h-[600px] xl:h-auto overflow-hidden shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-800 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-emerald-400" />
            Situation Alert Feed
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Redirection warnings */}
            {nudges.map((nudge, index) => (
              <div key={`nudge-${index}`} className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-lg flex gap-3 text-xs">
                <Car className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded font-bold uppercase">
                    Transport Redirect
                  </span>
                  <p className="text-slate-300 mt-1 font-medium">{nudge.message}</p>
                </div>
              </div>
            ))}

            {/* Threshold alerts */}
            {alerts.length === 0 && nudges.length === 0 ? (
              <div className="text-center py-20 text-slate-500 text-xs">
                <Clock className="w-6 h-6 mx-auto mb-2 text-slate-700 animate-spin" />
                Monitoring live threshold logs...
              </div>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border space-y-3 transition ${
                    alert.acknowledged 
                      ? 'bg-slate-900/25 border-slate-850 opacity-55' 
                      : (alert.threshold_crossed === 'critical' ? 'bg-rose-950/20 border-rose-500/50 shadow-md' : 'bg-amber-950/10 border-amber-500/30')
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      alert.threshold_crossed === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {alert.threshold_crossed} Surge
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-200 capitalize">
                      Zone: {alert.zone_id.replace('zone_', '').replace('_', ' ')}
                    </p>
                    <p className="text-slate-400 leading-relaxed">{alert.generated_summary}</p>
                  </div>

                  <div className="bg-slate-950/60 p-2 border border-slate-850 rounded text-xs">
                    <p className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Recommendation
                    </p>
                    <p className="text-slate-300 mt-1 font-medium">{alert.recommended_action}</p>
                  </div>

                  <div className="flex justify-end">
                    {alert.acknowledged ? (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Acknowledged
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-800 transition"
                      >
                        Acknowledge
                      </button>
                    )}
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
