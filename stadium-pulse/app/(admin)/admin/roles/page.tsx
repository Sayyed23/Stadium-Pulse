import { ShieldCheck, Plus } from "lucide-react";

const roles = [
  {
    id: "r1",
    name: "Super Admin",
    usersCount: 2,
    description: "Full system control and database access",
  },
  {
    id: "r2",
    name: "Ops Commander",
    usersCount: 5,
    description:
      "Control room monitoring, alert acknowledgment, and volunteer dispatch",
  },
  {
    id: "r3",
    name: "Volunteer",
    usersCount: 48,
    description:
      "Assigned tasks intake, field incident reporting, and copilot access",
  },
  {
    id: "r4",
    name: "Venue Manager",
    usersCount: 3,
    description: "Read-only access to venue telemetry and historical reporting",
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Roles & Permissions</h2>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg">
                <ShieldCheck size={18} className="text-violet-500" />
                {r.name}
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-violet-500/10 text-violet-400">
                {r.usersCount} users
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {r.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
