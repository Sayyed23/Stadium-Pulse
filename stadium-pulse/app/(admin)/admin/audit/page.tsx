import { ScrollText, ShieldAlert, CheckCircle2 } from "lucide-react";

const logs = [
  { id: "log1", action: "ALERT_ACKNOWLEDGED", actor: "meena_ops", details: "Acknowledged critical alert for Zone B", timestamp: "2026-07-18 16:15:22" },
  { id: "log2", action: "INCIDENT_DISPATCH", actor: "copilot_bot", details: "Dispatched volunteer VOL-001 to Zone B", timestamp: "2026-07-18 16:12:05" },
  { id: "log3", action: "GROUNDING_AUDIT_PASSED", actor: "gemini_guardrail", details: "Query verified with 0 unverified IDs", timestamp: "2026-07-18 16:08:44" },
  { id: "log4", action: "THRESHOLD_CHANGED", actor: "ismail_admin", details: "Updated warning threshold from 80% to 85%", timestamp: "2026-07-18 15:30:00" },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Audit Logs</h2>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Timestamp</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Action</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Actor</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 font-mono text-xs">
                <td className="py-3 px-5 text-zinc-400">{l.timestamp}</td>
                <td className="py-3 px-5 font-semibold text-violet-400">{l.action}</td>
                <td className="py-3 px-5">{l.actor}</td>
                <td className="py-3 px-5 text-zinc-300 font-sans">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
