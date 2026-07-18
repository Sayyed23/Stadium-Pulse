"use client";

import { useEffect, useState } from "react";
import { AlertCard } from "@/components/alerts/AlertCard";
import { Users } from "lucide-react";

export default function DashboardPage() {
  const [zones, setZones] = useState<Record<string, any>>({});
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/zones/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "zone_update") {
          setZones(prev => ({
            ...prev,
            [data.zone_id]: data
          }));
        } else if (data.type === "alert") {
          setAlerts(prev => [data, ...prev].slice(0, 50)); // Keep last 50
        }
      } catch (e) {
        console.error("SSE parse error", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Ops Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 h-[600px] flex flex-col">
          <h3 className="font-semibold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> Live Heatmap
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {zoneList.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500">
                Waiting for zone data...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {zoneList.map(zone => {
                  const pct = Math.round(zone.pct * 100);
                  const isCritical = pct >= 95;
                  const isWarning = pct >= 85 && pct < 95;
                  const colorClass = isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-green-500";
                  const borderClass = isCritical ? "border-red-200 dark:border-red-900" : isWarning ? "border-amber-200 dark:border-amber-900" : "border-zinc-200 dark:border-zinc-800";
                  
                  return (
                    <div key={zone.zone_id} className={`p-4 rounded-lg border ${borderClass} bg-white dark:bg-zinc-950 relative overflow-hidden`}>
                      <div className="relative z-10">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">{zone.zone_name}</div>
                        <div className="text-2xl font-bold my-1">{pct}%</div>
                        <div className="text-xs text-zinc-500">{zone.current_count} / {zone.capacity}</div>
                      </div>
                      <div className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${colorClass}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 h-[600px] flex flex-col">
          <h3 className="font-semibold text-lg border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4">Live Situation Feed</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2" aria-live="polite">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animation-delay-400"></div>
                </div>
                <p className="text-sm">Listening for threshold alerts...</p>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <AlertCard
                  key={`${alert.alert_id}-${i}`}
                  id={alert.alert_id}
                  zoneId={alert.zone_name}
                  level={alert.threshold_crossed === "critical" ? "critical" : alert.threshold_crossed === "warning" ? "warning" : "info"}
                  summary={alert.generated_summary}
                  action={alert.recommended_action}
                  time={new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  acknowledged={alert.acknowledged}
                  onAcknowledge={handleAcknowledge}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
