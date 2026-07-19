import { Users, Plus, Edit, Shield } from "lucide-react";

const users = [
  {
    id: "u1",
    name: "Ismail Sayyed",
    email: "ismail@stadiumpulse.ai",
    role: "Super Admin",
    status: "Active",
  },
  {
    id: "u2",
    name: "Meena Patel",
    email: "meena@stadiumpulse.ai",
    role: "Ops Lead",
    status: "Active",
  },
  {
    id: "u3",
    name: "Arjun Kumar",
    email: "arjun@stadiumpulse.ai",
    role: "Volunteer",
    status: "Active",
  },
  {
    id: "u4",
    name: "Sarah Jenkins",
    email: "sarah@stadiumpulse.ai",
    role: "Venue Manager",
    status: "Inactive",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">User Management</h2>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                User
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Role
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Status
              </th>
              <th className="py-3 px-5 text-xs font-semibold text-zinc-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {users.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              >
                <td className="py-3 px-5 text-sm font-medium flex items-center gap-2">
                  <Users size={14} className="text-violet-500" />
                  <div>
                    <div>{u.name}</div>
                    <div className="text-xs text-zinc-400 font-normal">
                      {u.email}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Shield size={12} /> {u.role}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${u.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Edit size={14} className="text-zinc-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
