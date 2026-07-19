"use client";

import { useZoneStream } from "@/hooks/useZoneStream";
import { AlertCard } from "@/components/alerts/AlertCard";
import { Users } from "lucide-react";

export default function DashboardPage() {
  const { zones, alerts, setAlerts } = useZoneStream();

  const handleAcknowledge = async (id: string) => {
    // Optimistic UI update
    setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
    
    // Call the real API
    try { 
      await fetch(`/api/alerts/${id}/ack`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledged_by: "dashboard_ops_user" })
      }); 
    } catch (e) {
      console.error("Failed to acknowledge alert", e);
    }
  };

  const zoneList = Object.values(zones).sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1d2022] border border-[#00f2ff]/30 p-5 rounded-2xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5cf968] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#5cf968] tracking-wider uppercase">Live Command Telemetry Stream</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Control Room Master Console</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#101415] border border-[#3a494b] text-xs font-mono text-[#00f2ff]">
            SYSTEM STATUS: OPERATIONAL (99.9%)
          </div>
          <button type="button" className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 font-mono font-bold text-xs hover:bg-red-500/30 transition-all uppercase">
            Emergency Lockdown
          </button>
        </div>
      </div>

      {/* Main Multi-panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Matrix Panel */}
        <div className="lg:col-span-6 bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-5 h-[620px] flex flex-col shadow-2xl">
          <h3 className="font-mono font-bold text-xs text-[#00f2ff] border-b border-[#3a494b]/30 pb-3 mb-4 flex items-center justify-between uppercase tracking-wider">
            <span className="flex items-center gap-2"><Users size={18} /> Zone Density & Flow Telemetry</span>
            <span className="text-[10px] text-[#b9cacb] font-normal">{zoneList.length} Sectors Active</span>
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-hide">
            {zoneList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#b9cacb] font-mono text-xs">
                <div className="w-6 h-6 rounded-full border-2 border-[#00f2ff] border-t-transparent animate-spin mb-2" />
                Waiting for zone data...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {zoneList.map(zone => {
                  const pct = Math.round(zone.pct * 100);
                  const isCritical = pct >= 95;
                  const isWarning = pct >= 85 && pct < 95;
                  let colorClass = "bg-[#5cf968]";
                  let borderClass = "border-[#3a494b]/40";
                  if (isCritical) {
                    colorClass = "bg-red-400";
                    borderClass = "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                  } else if (isWarning) {
                    colorClass = "bg-amber-400";
                    borderClass = "border-amber-500/50";
                  }
                  
                  return (
                    <div key={zone.zone_id} className={`p-4 rounded-xl border ${borderClass} bg-[#101415] relative overflow-hidden space-y-2`}>
                      <div className="relative z-10">
                        <div className="font-bold text-xs text-white truncate">{zone.zone_name}</div>
                        <div className="text-3xl font-extrabold font-mono text-[#00f2ff] my-1">{pct}%</div>
                        <div className="text-[10px] font-mono text-[#b9cacb]">{zone.current_count} / {zone.capacity}</div>
                      </div>
                      <div className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ${colorClass}`} style={{ width: `${pct}%` }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Live Situation Feed Panel */}
        <div className="lg:col-span-6 bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-5 h-[620px] flex flex-col shadow-2xl">
          <h3 className="font-mono font-bold text-xs text-[#00f2ff] border-b border-[#3a494b]/30 pb-3 mb-4 flex items-center justify-between uppercase tracking-wider">
            <span>AI Incident & Threshold Situation Feed</span>
            <span className="text-[10px] text-[#5cf968] font-normal">{alerts.length} Active Events</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide" aria-live="polite">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#b9cacb] space-y-2 font-mono text-xs">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-[#00f2ff] rounded-full" />
                  <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                </div>
                <p>Monitoring event streams & threshold alerts...</p>
              </div>
            ) : (
              alerts.map((alert, i) => {
                let alertLevel: "critical" | "warning" | "info" = "info";
                if (alert.threshold_crossed === "critical") {
                  alertLevel = "critical";
                } else if (alert.threshold_crossed === "warning") {
                  alertLevel = "warning";
                }

                return (
                  <AlertCard
                    key={`${alert.alert_id}-${i}`}
                    id={alert.alert_id}
                    zoneId={alert.zone_name}
                    level={alertLevel}
                    summary={alert.generated_summary}
                    action={alert.recommended_action}
                    time={new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    acknowledged={alert.acknowledged}
                    onAcknowledge={handleAcknowledge}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
