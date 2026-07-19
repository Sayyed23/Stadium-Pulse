import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function IncidentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans p-4">
      <Link
        href="/ops/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline"
      >
        <ArrowLeft size={14} /> Back to Ops Dashboard
      </Link>

      <div className="bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-[#00f2ff]" size={26} /> Incident
            Management Console
          </h2>
          <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">
            Real-time incident tracking & staff dispatch log
          </p>
        </div>
      </div>

      <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-4 min-h-[400px] shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-[#3a494b]/40 text-xs font-mono text-[#00f2ff] uppercase">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Zone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Priority</th>
            </tr>
          </thead>
          <tbody className="text-xs text-[#e0e3e5]">
            <tr className="border-b border-[#3a494b]/20">
              <td className="py-3 px-4 font-mono text-[#00f2ff]">INC-901</td>
              <td className="py-3 px-4 font-bold">Medical First Aid</td>
              <td className="py-3 px-4 font-mono">Zone A (Gate 12)</td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#5cf968]/10 text-[#5cf968] border border-[#5cf968]/30">
                  DISPATCHED
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                  HIGH
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={5}
                className="py-8 text-center text-[#b9cacb] font-mono"
              >
                All other sectors clear. Monitoring SSE event stream...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
