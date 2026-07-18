import { UserCog, Plus, MapPin, Globe } from "lucide-react";

const volunteers = [
  { id: "v1", name: "Arjun Kumar", zone: "Zone B", languages: ["en", "hi"], shift: "Evening (14:00 - 22:00)" },
  { id: "v2", name: "Meena Patel", zone: "Zone A", languages: ["en", "mr", "hi"], shift: "Evening (14:00 - 22:00)" },
  { id: "v3", name: "Raj Singh", zone: "Zone C", languages: ["en"], shift: "Morning (08:00 - 16:00)" },
];

export default function AdminVolunteersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Volunteer Management (Admin)</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
          <Plus size={16} /> Register Volunteer
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Volunteer</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Assigned Zone</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Languages</th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">Shift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {volunteers.map((v) => (
              <tr key={v.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2">
                  <UserCog size={14} className="text-violet-500" />
                  {v.name}
                </td>
                <td className="py-3 px-5 text-sm text-zinc-400 flex items-center gap-1"><MapPin size={12} />{v.zone}</td>
                <td className="py-3 px-5 text-sm flex items-center gap-1">
                  <Globe size={12} className="text-zinc-400" /> {v.languages.join(", ").toUpperCase()}
                </td>
                <td className="py-3 px-5 text-sm text-zinc-400">{v.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
