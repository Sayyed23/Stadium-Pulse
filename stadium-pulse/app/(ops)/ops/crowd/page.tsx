"use client";

import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";

import { MOCK_CROWD_ZONES as zones } from "@/lib/mock-data";


const predictions = [
  {
    time: "+15 min",
    zone: "Zone B",
    predicted: 96,
    action: "Redirect via Gate 7",
  },
  {
    time: "+30 min",
    zone: "Concourse L1",
    predicted: 90,
    action: "Open overflow corridor",
  },
  { time: "+15 min", zone: "Zone A", predicted: 78, action: "Monitor" },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-red-400" />;
  if (trend === "down")
    return <TrendingDown size={14} className="text-emerald-400" />;
  return <Minus size={14} className="text-slate-400" />;
};

export default function OpsCrowdPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Crowd Monitoring</h2>
        <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
          Live
        </span>
      </div>

      {/* Zone Heatmap */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const isCritical = zone.pct >= 85;
          const isWarning = zone.pct >= 65;
          let barColor = "bg-emerald-500";
          let borderColor = "border-zinc-200 dark:border-zinc-800";
          if (isCritical) {
            barColor = "bg-red-500";
            borderColor = "border-red-500/30";
          } else if (isWarning) {
            barColor = "bg-amber-500";
            borderColor = "border-amber-500/30";
          }

          return (
            <div
              key={zone.id}
              className={`bg-white dark:bg-zinc-900 border ${borderColor} rounded-xl p-4 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{zone.name}</span>
                <TrendIcon trend={zone.trend} />
              </div>
              <div className="text-3xl font-bold mb-2">{zone.pct}%</div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                  style={{ width: `${zone.pct}%` }}
                />
              </div>
              <div className="text-xs text-zinc-500">
                {zone.count.toLocaleString()} / {zone.capacity.toLocaleString()}
              </div>
              {isCritical && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Occupancy Charts Placeholder */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-500" /> Occupancy Trends
        </h3>
        <div className="h-48 flex items-end gap-2">
          {[40, 55, 62, 58, 72, 85, 91, 88, 78, 72, 65, 58].map((v, i) => {
            let bgClass = "bg-blue-500";
            if (v >= 85) bgClass = "bg-red-500";
            else if (v >= 65) bgClass = "bg-amber-500";

            return (
              <div
                key={`chart-col-${i}`}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-full rounded-t ${bgClass} transition-all`}
                  style={{ height: `${v * 1.8}px` }}
                />
                <span className="text-[9px] text-zinc-400">{14 + i}:00</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Activity size={16} className="text-purple-500" /> AI Predictions
          </h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {predictions.map((p) => {
            let textColor = "text-zinc-400";
            if (p.predicted >= 90) textColor = "text-red-400";
            else if (p.predicted >= 80) textColor = "text-amber-400";

            return (
              <div
                key={p.zone + p.time}
                className="px-5 py-3.5 flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-medium">{p.zone}</span>
                  <span className="text-xs text-zinc-400 ml-2">({p.time})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${textColor}`}>
                    {p.predicted}%
                  </span>
                  <span className="text-xs text-zinc-400">{p.action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
