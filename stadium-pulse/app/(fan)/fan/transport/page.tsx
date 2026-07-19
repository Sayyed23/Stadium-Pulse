"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Bus, Car, Train, AlertTriangle, ArrowLeft } from "lucide-react";

interface TransportZone {
  zone_id: string;
  name: string;
  transport_type: string;
  current_count: number;
  capacity: number;
  pct: number;
}

const typeIcon: Record<string, React.ReactNode> = {
  shuttle: <Bus className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  metro: <Train className="w-5 h-5" />,
};

function statusColor(pct: number) {
  if (pct >= 0.9) return { bar: "bg-red-500", badge: "text-red-400 bg-red-500/10", label: "Full" };
  if (pct >= 0.7) return { bar: "bg-amber-500", badge: "text-amber-400 bg-amber-500/10", label: "Filling" };
  return { bar: "bg-emerald-500", badge: "text-emerald-400 bg-emerald-500/10", label: "Available" };
}

function TransportZoneItem({ zone }: { zone: TransportZone }) {
  const s = useMemo(() => statusColor(zone.pct), [zone.pct]);
  return (
    <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 transition-all duration-300 hover:border-[#00f2ff]/40 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[#00f2ff]">
            {typeIcon[zone.transport_type] || <Bus className="w-5 h-5" />}
          </span>
          <span className="font-bold text-sm text-white">{zone.name}</span>
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${s.badge}`}
          aria-label={`Status: ${s.label}`}
        >
          {s.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full h-2 bg-[#101415] rounded-full overflow-hidden mb-2"
        role="progressbar"
        aria-valuenow={Math.round(zone.pct * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${zone.name} capacity`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${s.bar}`}
          style={{ width: `${Math.min(zone.pct * 100, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs font-mono text-[#b9cacb]">
        <span>{zone.current_count} / {zone.capacity} Units</span>
        <span>{Math.round(zone.pct * 100)}% Capacity</span>
      </div>
    </div>
  );
}

export default function TransportPage() {
  const [zones, setZones] = useState<TransportZone[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/zones/stream");

    es.addEventListener("transport_update", (e) => {
      const data = JSON.parse(e.data) as TransportZone;
      setZones((prev) => {
        const idx = prev.findIndex((z) => z.zone_id === data.zone_id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = data;
          return copy;
        }
        return [...prev, data];
      });
      setConnected(true);
    });

    es.onerror = () => setConnected(false);

    return () => es.close();
  }, []);

  const shuttles = zones.filter((z) => z.transport_type === "shuttle");
  const parking = zones.filter((z) => z.transport_type === "parking");
  const metro = zones.filter((z) => z.transport_type === "metro");
  const other = zones.filter(
    (z) => !["shuttle", "parking", "metro"].includes(z.transport_type)
  );

  const sections = [
    { title: "Shuttles", icon: <Bus className="w-5 h-5" />, items: shuttles },
    { title: "Parking", icon: <Car className="w-5 h-5" />, items: parking },
    { title: "Metro", icon: <Train className="w-5 h-5" />, items: metro },
    ...(other.length > 0 ? [{ title: "Other", icon: <Bus className="w-5 h-5" />, items: other }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 font-sans space-y-6">
      <Link href="/fan" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
        <ArrowLeft size={14} /> Back to Fan Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Transport & Parking Telemetry</h2>
          <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">Live shuttle countdowns, parking capacities & transit alerts</p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full border ${
            connected
              ? "bg-[#5cf968]/10 text-[#5cf968] border-[#5cf968]/30"
              : "bg-[#3a494b]/20 text-[#b9cacb] border-[#3a494b]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${connected ? "bg-[#5cf968] animate-pulse" : "bg-slate-500"}`}
          />
          {connected ? "LIVE TELEMETRY" : "CONNECTING…"}
        </span>
      </div>

      {/* Nudge Banner */}
      {zones.some((z) => z.pct >= 0.9) && (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-[#b9cacb]">
            Some parking & transit options are near capacity. Consider alternatives marked
            <span className="font-bold text-[#5cf968]"> AVAILABLE</span>.
          </p>
        </div>
      )}

      {/* Sections */}
      <div aria-live="polite" aria-atomic="false">
        {zones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[#b9cacb]">
            <Bus className="w-10 h-10 mb-3 animate-bounce text-[#00f2ff]" />
            <p className="text-xs font-mono uppercase tracking-wider">Loading Live Transport Status...</p>
          </div>
        )}

        {sections
          .filter((s) => s.items.length > 0)
          .map((section) => (
            <div key={section.title} className="mb-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider mb-3">
                {section.icon}
                {section.title}
              </div>
              <div className="grid gap-3">
                {section.items.map((zone) => (
                  <TransportZoneItem key={zone.zone_id} zone={zone} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
