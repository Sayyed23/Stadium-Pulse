"use client";

import { Users, Clock, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

const zones = [
  { id: "zone_a", name: "Zone A — North Stand", pct: 72, count: 5760, capacity: 8000, trend: "up" as const },
  { id: "zone_b", name: "Zone B — South Stand", pct: 91, count: 7280, capacity: 8000, trend: "up" as const },
  { id: "zone_c", name: "Zone C — East Wing", pct: 58, count: 2900, capacity: 5000, trend: "stable" as const },
  { id: "zone_d", name: "Zone D — West Wing", pct: 45, count: 2250, capacity: 5000, trend: "down" as const },
  { id: "zone_e", name: "Concourse Level 1", pct: 83, count: 4150, capacity: 5000, trend: "up" as const },
  { id: "zone_f", name: "Concourse Level 2", pct: 35, count: 1050, capacity: 3000, trend: "down" as const },
];

const alternateRoutes = [
  { from: "Zone B (crowded)", to: "Zone D via Gate 7", saving: "~3 min faster" },
  { from: "North Food Court", to: "South Food Court", saving: "Less crowded" },
  { from: "Concourse L1", to: "Concourse L2 via Lift 4", saving: "40% less crowd" },
];

const waitTimes = [
  { name: "North Food Court", wait: "12 min", trend: "up" },
  { name: "South Food Court", wait: "5 min", trend: "down" },
  { name: "Restroom A1", wait: "3 min", trend: "stable" },
  { name: "Merch Store", wait: "8 min", trend: "up" },
  { name: "ATM — SBI", wait: "4 min", trend: "stable" },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp size={12} className="text-red-400" />;
  if (trend === "down") return <TrendingDown size={12} className="text-emerald-400" />;
  return <Minus size={12} className="text-slate-400" />;
};

export default function CrowdPage() {
  return (
    <div className="flex flex-col gap-6 p-4 pb-28 max-w-lg mx-auto font-sans">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Live Crowd Heatmap</h2>
        <p className="text-xs text-[#b9cacb]">Real-time stadium occupancy & flow telemetry</p>
      </div>

      {/* Crowd Heatmap Grid */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#00f2ff] uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Users size={14} />
          Zone Occupancy Matrix
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {zones.map((zone) => {
            const isCritical = zone.pct >= 85;
            const isWarning = zone.pct >= 65 && zone.pct < 85;
            const barColor = isCritical ? "bg-red-400" : isWarning ? "bg-amber-400" : "bg-[#5cf968]";
            const borderColor = isCritical ? "border-red-500/40" : isWarning ? "border-amber-500/40" : "border-[#3a494b]/50";

            return (
              <div key={zone.id} className={`bg-[#1d2022] rounded-2xl p-4 border ${borderColor} shadow-lg space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate pr-1">{zone.name}</span>
                  <TrendIcon trend={zone.trend} />
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#00f2ff]">
                  {zone.pct}%
                </div>
                <div className="w-full h-2 bg-[#101415] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${zone.pct}%` }} />
                </div>
                <div className="text-[10px] font-mono text-[#b9cacb]">
                  {zone.count.toLocaleString()} / {zone.capacity.toLocaleString()}
                </div>
                {isCritical && (
                  <div className="mt-1 text-[10px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full inline-block">
                    CRITICAL DENSITY
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Busy Zones Alert */}
      {zones.some((z) => z.pct >= 85) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4" role="alert">
          <div className="text-xs font-mono font-bold text-amber-400 mb-1">⚠ HIGH CONGESTION DETECTED</div>
          <p className="text-xs text-[#b9cacb]">
            {zones.filter((z) => z.pct >= 85).map((z) => z.name).join(", ")} {zones.filter((z) => z.pct >= 85).length === 1 ? "is" : "are"} near peak capacity. Consider alternate walkways.
          </p>
        </div>
      )}

      {/* Alternate Routes */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-3 px-1">
          AI Suggested Alternate Routes
        </h3>
        <div className="space-y-2">
          {alternateRoutes.map((route) => (
            <div key={route.from} className="bg-[#1d2022] border border-[#3a494b]/40 rounded-xl p-3.5 flex items-center justify-between hover:border-[#00f2ff]/30 transition-all cursor-pointer">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-[#b9cacb] truncate">{route.from}</span>
                <ArrowRight size={12} className="text-[#00f2ff] shrink-0" />
                <span className="text-xs font-bold text-white truncate">{route.to}</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#5cf968] bg-[#5cf968]/10 border border-[#5cf968]/20 px-2.5 py-0.5 rounded-full shrink-0 ml-2">
                {route.saving}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Waiting Times */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Clock size={14} />
          Estimated Queue Wait Times
        </h3>
        <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl divide-y divide-[#3a494b]/30 overflow-hidden">
          {waitTimes.map((item) => (
            <div key={item.name} className="flex items-center justify-between px-4 py-3.5">
              <span className="text-xs font-medium text-white">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00f2ff]">{item.wait}</span>
                <TrendIcon trend={item.trend} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
