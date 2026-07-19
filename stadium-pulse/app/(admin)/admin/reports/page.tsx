import { BarChart3, Download } from "lucide-react";

const reports = [
  {
    id: "rep1",
    name: "Tournament Crowd Density Summary",
    dateRange: "Matchdays 1 - 4",
    type: "PDF / CSV",
  },
  {
    id: "rep2",
    name: "Incident SLA & Response Performance",
    dateRange: "Last 7 Days",
    type: "PDF",
  },
  {
    id: "rep3",
    name: "Grounding Hallucination & Query Log Audit",
    dateRange: "Last 30 Days",
    type: "CSV",
  },
  {
    id: "rep4",
    name: "Sustainability & Transport Operations Metrics",
    dateRange: "Tournament Total",
    type: "PDF / CSV",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">System Reports</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-base flex items-center gap-2 mb-1">
                <BarChart3 size={18} className="text-violet-500" />
                {r.name}
              </div>
              <div className="text-xs text-zinc-400">
                Timeframe: {r.dateRange} · Format: {r.type}
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors shrink-0"
            >
              <Download size={14} /> Export
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
