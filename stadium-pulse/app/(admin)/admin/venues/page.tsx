import { Building2, MapPin, Plus, Edit, Trash2 } from "lucide-react";

const venues = [
  { id: "v1", name: "Mumbai Cricket Stadium", city: "Mumbai", capacity: 33000, zones: 8, status: "active" },
  { id: "v2", name: "Delhi Sports Complex", city: "New Delhi", capacity: 45000, zones: 12, status: "draft" },
];

export default function VenuesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Venue Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> Add Venue
        </button>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead><tr className="border-b border-zinc-200 dark:border-zinc-800">
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Venue</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">City</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Capacity</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Zones</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Status</th>
            <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {venues.map((v) => (
              <tr key={v.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2"><Building2 size={14} className="text-violet-500" />{v.name}</td>
                <td className="py-3 px-5 text-sm text-zinc-400 flex items-center gap-1"><MapPin size={12} />{v.city}</td>
                <td className="py-3 px-5 text-sm">{v.capacity.toLocaleString()}</td>
                <td className="py-3 px-5 text-sm">{v.zones}</td>
                <td className="py-3 px-5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${v.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}>{v.status}</span></td>
                <td className="py-3 px-5 flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><Edit size={14} className="text-zinc-400" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
