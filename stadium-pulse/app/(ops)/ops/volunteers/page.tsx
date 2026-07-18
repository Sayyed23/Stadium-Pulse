import { MapPin, Clock } from "lucide-react";

const volunteers = [
  { id: "VOL-001", name: "Arjun Kumar", zone: "Zone B", status: "available", tasks: 3, responseTime: "2.5 min" },
  { id: "VOL-002", name: "Meena Patel", zone: "Zone A", status: "busy", tasks: 5, responseTime: "3.1 min" },
  { id: "VOL-003", name: "Raj Singh", zone: "Zone C", status: "available", tasks: 2, responseTime: "1.8 min" },
  { id: "VOL-004", name: "Priya Desai", zone: "Zone D", status: "offline", tasks: 0, responseTime: "—" },
  { id: "VOL-005", name: "Ahmed Khan", zone: "Zone B", status: "available", tasks: 4, responseTime: "2.2 min" },
  { id: "VOL-006", name: "Sneha Joshi", zone: "Zone A", status: "busy", tasks: 6, responseTime: "3.5 min" },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  available: { color: "bg-emerald-500", label: "Available" },
  busy: { color: "bg-amber-500", label: "Busy" },
  offline: { color: "bg-slate-500", label: "Offline" },
};

export default function OpsVolunteersPage() {
  const available = volunteers.filter((v) => v.status === "available").length;
  const busy = volunteers.filter((v) => v.status === "busy").length;
  const offline = volunteers.filter((v) => v.status === "offline").length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Volunteer Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-blue-400">{volunteers.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Available</p>
          <p className="text-2xl font-bold text-emerald-400">{available}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Busy</p>
          <p className="text-2xl font-bold text-amber-400">{busy}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Offline</p>
          <p className="text-2xl font-bold text-slate-400">{offline}</p>
        </div>
      </div>

      {/* Volunteer Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Volunteer</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Zone</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Status</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Tasks</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Avg Response</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {volunteers.map((v) => {
              const s = statusConfig[v.status];
              return (
                <tr key={v.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-500">
                        {v.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{v.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{v.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-sm flex items-center gap-1"><MapPin size={12} className="text-zinc-400" />{v.zone}</td>
                  <td className="py-3.5 px-5">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-sm">{v.tasks}</td>
                  <td className="py-3.5 px-5 text-sm flex items-center gap-1"><Clock size={12} className="text-zinc-400" />{v.responseTime}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
