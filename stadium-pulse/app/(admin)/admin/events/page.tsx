import { CalendarDays, Plus, Edit, Trash2, Clock } from "lucide-react";

const events = [
  { id: "e1", name: "Cricket World Cup — Semi-Final", date: "2026-07-20", venue: "Mumbai Cricket Stadium", status: "upcoming", gates: "14:00" },
  { id: "e2", name: "Cricket World Cup — Quarter-Final 1", date: "2026-07-18", venue: "Mumbai Cricket Stadium", status: "live", gates: "14:00" },
  { id: "e3", name: "Cricket World Cup — Quarter-Final 2", date: "2026-07-17", venue: "Mumbai Cricket Stadium", status: "completed", gates: "14:00" },
];

const statusColors: Record<string, string> = {
  live: "bg-emerald-500/10 text-emerald-400",
  upcoming: "bg-blue-500/10 text-blue-400",
  completed: "bg-zinc-500/10 text-zinc-400",
};

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Event Management</h2>
        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"><Plus size={16} /> Add Event</button>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="border-b border-zinc-200 dark:border-zinc-800">
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Event</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Date</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Venue</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Gates Open</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Status</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2"><CalendarDays size={14} className="text-violet-500" />{e.name}</td>
                <td className="py-3 px-5 text-sm text-zinc-400">{e.date}</td>
                <td className="py-3 px-5 text-sm">{e.venue}</td>
                <td className="py-3 px-5 text-sm flex items-center gap-1"><Clock size={12} className="text-zinc-400" />{e.gates}</td>
                <td className="py-3 px-5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusColors[e.status]}`}>{e.status}</span></td>
                <td className="py-3 px-5 flex items-center gap-2">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><Edit size={14} className="text-zinc-400" /></button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
