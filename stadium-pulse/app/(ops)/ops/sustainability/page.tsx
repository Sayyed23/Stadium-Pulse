"use client";

import { useEffect, useState } from "react";
import {
  Bus,
  Car,
  Train,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────── */

interface TransportZone {
  zone_id: string;
  name: string;
  transport_type: string;
  current_count: number;
  capacity: number;
  pct: number;
}

interface WasteBinAlert {
  bin_id: string;
  zone_id: string;
  fill_pct: number;
  timestamp?: string;
}

/* ── Helpers ────────────────────────────────────────────────── */

const typeIcon: Record<string, React.ReactNode> = {
  shuttle: <Bus className="w-5 h-5" />,
  parking: <Car className="w-5 h-5" />,
  metro: <Train className="w-5 h-5" />,
};

import { getTransportStatusColor as statusColor } from "@/lib/transport-utils";


function handleTransportUpdate(prev: TransportZone[], data: TransportZone) {
  const idx = prev.findIndex((z) => z.zone_id === data.zone_id);
  if (idx >= 0) {
    const copy = [...prev];
    copy[idx] = data;
    return copy;
  }
  return [...prev, data];
}

function handleWasteBinAlert(prev: WasteBinAlert[], data: WasteBinAlert) {
  const withTs = { ...data, timestamp: new Date().toISOString() };
  // Keep most recent 30 alerts, dedup by bin_id (keep latest)
  const filtered = prev.filter((b) => b.bin_id !== data.bin_id);
  return [withTs, ...filtered].slice(0, 30);
}

/* ── Component ──────────────────────────────────────────────── */

export default function SustainabilityPage() {
  const [transport, setTransport] = useState<TransportZone[]>([]);
  const [wasteBins, setWasteBins] = useState<WasteBinAlert[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/zones/stream");

    es.addEventListener("transport_update", (e) => {
      const data = JSON.parse(e.data) as TransportZone;
      setTransport((prev) => handleTransportUpdate(prev, data));
      setConnected(true);
    });

    es.addEventListener("waste_bin_alert", (e) => {
      const data = JSON.parse(e.data) as WasteBinAlert;
      setWasteBins((prev) => handleWasteBinAlert(prev, data));
      setConnected(true);
    });

    es.onerror = () => setConnected(false);
    return () => es.close();
  }, []);

  /* ── Stats ────────────────────────────────────────────────── */
  const fullCount = transport.filter((z) => z.pct >= 0.9).length;
  const fillingCount = transport.filter(
    (z) => z.pct >= 0.7 && z.pct < 0.9
  ).length;
  const okCount = transport.filter((z) => z.pct < 0.7).length;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Sustainability & Transport</h2>
        <span
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
            connected
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-zinc-500/10 text-zinc-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
            }`}
          />
          {connected ? "Live" : "Connecting…"}
        </span>
      </div>

      {/* ── Summary Stat Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Hubs"
          value={transport.length}
          color="text-blue-400"
        />
        <StatCard label="Available" value={okCount} color="text-emerald-400" />
        <StatCard label="Filling" value={fillingCount} color="text-amber-400" />
        <StatCard label="Full" value={fullCount} color="text-red-400" />
      </div>

      {/* ── Two-Column Layout ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Transport Hub Status */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <Bus className="w-4 h-4 text-zinc-400" />
            <h3 className="font-semibold text-sm">Transport Hub Status</h3>
          </div>

          <div
            className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[36rem] overflow-y-auto"
            aria-live="polite"
          >
            {transport.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <Bus className="w-8 h-8 mb-2 animate-pulse" />
                <p className="text-sm">Waiting for transport data…</p>
              </div>
            )}

            {transport.map((zone) => {
              const s = statusColor(zone.pct);
              return (
                <div
                  key={zone.zone_id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="text-zinc-400 shrink-0">
                    {typeIcon[zone.transport_type] || (
                      <Bus className="w-5 h-5" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium truncate">
                        {zone.name}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${s.badge}`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${s.bar}`}
                        style={{ width: `${Math.min(zone.pct * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                      <span>
                        {zone.current_count} / {zone.capacity}
                      </span>
                      <span>{Math.round(zone.pct * 100)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Waste Bin Monitors */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <Trash2 className="w-4 h-4 text-zinc-400" />
            <h3 className="font-semibold text-sm">Waste Bin Alerts</h3>
            {wasteBins.length > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold">
                {wasteBins.length}
              </span>
            )}
          </div>

          <div
            className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[36rem] overflow-y-auto"
            aria-live="polite"
          >
            {wasteBins.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500/60" />
                <p className="text-sm">All bins are below threshold</p>
              </div>
            )}

            {wasteBins.map((bin) => (
              <div
                key={`${bin.bin_id}-${bin.timestamp}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors"
              >
                <span className="shrink-0">
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      bin.fill_pct >= 0.95 ? "text-red-400" : "text-amber-400"
                    }`}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">
                      Bin {bin.bin_id.slice(0, 8)}…
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        bin.fill_pct >= 0.95 ? "text-red-400" : "text-amber-400"
                      }`}
                    >
                      {Math.round(bin.fill_pct * 100)}% full
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Zone {bin.zone_id.slice(0, 8)}…
                    {bin.timestamp && (
                      <>
                        {" · "}
                        {new Date(bin.timestamp).toLocaleTimeString()}
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────────────── */

function StatCard({
  label,
  value,
  color,
}: Readonly<{
  label: string;
  value: number;
  color: string;
}>) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
