import { BellRing, Plus } from "lucide-react";

const templates = [
  { id: "nt1", name: "High Crowd Density Alert", channel: "Push & SSE", target: "Ops Staff" },
  { id: "nt2", name: "Incident Dispatch Request", channel: "Push & SMS", target: "Volunteers" },
  { id: "nt3", name: "Waste Bin Capacity Breach", channel: "Push", target: "Sanitation Team" },
  { id: "nt4", name: "Match Gate Ingress Announcement", channel: "Push", target: "Spectators" },
];

export default function NotificationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Notification Templates</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Template Name</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Channels</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Target Audience</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {templates.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2">
                  <BellRing size={14} className="text-violet-500" />
                  {t.name}
                </td>
                <td className="py-3 px-5 text-sm text-zinc-400">{t.channel}</td>
                <td className="py-3 px-5 text-sm">{t.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
