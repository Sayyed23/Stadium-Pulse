"use client";

import { useEffect, useState } from "react";
import { Bus, Car, Train, AlertTriangle } from "lucide-react";

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
    <div className="flex flex-col gap-5 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transport</h2>
        <span
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            connected
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-zinc-500/10 text-zinc-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`}
          />
          {connected ? "Live" : "Connecting…"}
        </span>
      </div>

      {/* Nudge Banner */}
      {zones.some((z) => z.pct >= 0.9) && (
        <div
          className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-200">
            Some transport options are near capacity. Consider alternatives marked
            <span className="font-semibold text-emerald-400"> Available</span>.
          </p>
        </div>
      )}

      {/* Sections */}
      <div aria-live="polite" aria-atomic="false">
        {zones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Bus className="w-10 h-10 mb-3 animate-pulse" />
            <p className="text-sm">Waiting for transport data…</p>
          </div>
        )}

        {sections
          .filter((s) => s.items.length > 0)
          .map((section) => (
            <div key={section.title} className="mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                {section.icon}
                {section.title}
              </div>
              <div className="grid gap-3">
                {section.items.map((zone) => {
                  const s = statusColor(zone.pct);
                  return (
                    <div
                      key={zone.zone_id}
                      className="bg-white/5 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 transition-all hover:border-zinc-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-zinc-400">
                            {typeIcon[zone.transport_type] || <Bus className="w-5 h-5" />}
                          </span>
                          <span className="font-medium text-sm">{zone.name}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                          {s.label}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${s.bar}`}
                          style={{ width: `${Math.min(zone.pct * 100, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>{zone.current_count} / {zone.capacity}</span>
                        <span>{Math.round(zone.pct * 100)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
