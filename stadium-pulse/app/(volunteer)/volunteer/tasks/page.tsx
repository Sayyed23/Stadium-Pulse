import { ListChecks, MapPin, Clock, CheckCircle2, Circle, Loader2 } from "lucide-react";

const tasks = [
  { id: "T-001", title: "Patrol Zone B concourse", zone: "Zone B", priority: "medium", due: "16:30", status: "in-progress" },
  { id: "T-002", title: "Assist wheelchair guest — Gate 3", zone: "Zone A", priority: "high", due: "16:15", status: "pending" },
  { id: "T-003", title: "Restock water station 2", zone: "Zone C", priority: "low", due: "17:00", status: "pending" },
  { id: "T-004", title: "Check waste bins — Concourse L1", zone: "Zone A", priority: "low", due: "17:30", status: "pending" },
  { id: "T-005", title: "Escort VIP guest to Box 2", zone: "VIP", priority: "high", due: "15:45", status: "completed" },
  { id: "T-006", title: "Replace directional signage — Gate 5", zone: "Zone B", priority: "low", due: "15:00", status: "completed" },
];

const priorityColors: Record<string, string> = {
  high: "bg-amber-500/10 text-amber-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-slate-500/10 text-slate-400",
};

const statusIcons: Record<string, React.ReactNode> = {
  "in-progress": <Loader2 size={16} className="text-blue-500 animate-spin" />,
  pending: <Circle size={16} className="text-slate-400" />,
  completed: <CheckCircle2 size={16} className="text-emerald-500" />,
};

export default function VolunteerTasksPage() {
  const active = tasks.filter((t) => t.status !== "completed");
  const done = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <ListChecks size={16} /> Active Tasks ({active.length})
        </h3>
      </div>

      <div className="space-y-3">
        {active.map((task) => (
          <div key={task.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="mt-0.5">{statusIcons[task.status]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{task.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${priorityColors[task.priority]}`}>{task.priority}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={10} />{task.zone}</span>
                <span className="flex items-center gap-1"><Clock size={10} />Due {task.due}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-emerald-500" /> Completed ({done.length})
        </h3>
        <div className="space-y-3 opacity-60">
          {done.map((task) => (
            <div key={task.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-start gap-3">
              <div className="mt-0.5">{statusIcons[task.status]}</div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium line-through">{task.title}</span>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={10} />{task.zone}</span>
                  <span>Completed at {task.due}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
