import { BarChart3, Users, AlertTriangle, Clock, FileDown, Bot } from "lucide-react";

const crowdMetrics = [
  { label: "Peak Occupancy", value: "91%", zone: "Zone B", time: "16:15" },
  { label: "Avg Occupancy", value: "64%", zone: "All Zones", time: "Today" },
  { label: "Threshold Breaches", value: "3", zone: "B, E", time: "Last 2 hrs" },
];

const incidentMetrics = [
  { category: "Medical", count: 4, avgResponse: "3.2 min", resolved: 3 },
  { category: "Crowd Control", count: 2, avgResponse: "2.8 min", resolved: 1 },
  { category: "Security", count: 1, avgResponse: "1.5 min", resolved: 1 },
  { category: "Facilities", count: 3, avgResponse: "5.1 min", resolved: 2 },
];

const aiReports = [
  { title: "Zone B Crowd Surge Analysis", time: "16:20", summary: "Identified pattern of rapid ingress through Gate 3. Recommend temporary diversion." },
  { title: "Half-Time Prediction Model", time: "15:45", summary: "Expected 30% increase in concourse traffic. Food courts will reach 90% capacity." },
  { title: "Transport Load Forecast", time: "14:30", summary: "Parking A expected to reach capacity by 17:00. Shuttle demand will peak at full-time." },
];

export default function OpsAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
          <FileDown size={16} />
          Export Report
        </button>
      </div>

      {/* Crowd Analytics */}
      <section>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Users size={18} className="text-blue-500" /> Crowd Analytics</h3>
        <div className="grid grid-cols-3 gap-4">
          {crowdMetrics.map((m) => (
            <div key={m.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-zinc-400 mt-1">{m.zone} · {m.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Occupancy Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 size={16} /> Hourly Occupancy</h3>
        <div className="h-40 flex items-end gap-1.5">
          {[20, 35, 45, 52, 61, 72, 80, 91, 88, 78, 65, 55, 48, 40].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-t transition-all ${v >= 85 ? "bg-red-500" : v >= 65 ? "bg-amber-500" : "bg-blue-500"}`} style={{ height: `${v * 1.5}px` }} />
              <span className="text-[8px] text-zinc-400">{12 + i}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Analytics */}
      <section>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Incident Analytics</h3>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Category</th>
                <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Count</th>
                <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Avg Response</th>
                <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Resolved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {incidentMetrics.map((m) => (
                <tr key={m.category}>
                  <td className="py-3 px-5 text-sm font-medium">{m.category}</td>
                  <td className="py-3 px-5 text-sm">{m.count}</td>
                  <td className="py-3 px-5 text-sm flex items-center gap-1"><Clock size={12} className="text-zinc-400" />{m.avgResponse}</td>
                  <td className="py-3 px-5 text-sm">{m.resolved}/{m.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Reports */}
      <section>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Bot size={18} className="text-purple-500" /> AI Reports</h3>
        <div className="space-y-3">
          {aiReports.map((r) => (
            <div key={r.title} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{r.title}</span>
                <span className="text-xs text-zinc-400">{r.time}</span>
              </div>
              <p className="text-xs text-zinc-400">{r.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
