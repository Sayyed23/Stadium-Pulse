import { UserCircle2, MapPin, Globe, Clock, BarChart3, Star, Award } from "lucide-react";

const stats = [
  { label: "Tasks Completed", value: "23", icon: BarChart3 },
  { label: "Incidents Resolved", value: "8", icon: Star },
  { label: "Avg Response Time", value: "3.2 min", icon: Clock },
  { label: "Satisfaction Score", value: "4.8/5", icon: Award },
];

const recentActivity = [
  { action: "Completed task: Patrol Zone B concourse", time: "16:30" },
  { action: "Responded to INC-042: Medical emergency", time: "16:12" },
  { action: "Completed task: Escort VIP guest to Box 2", time: "15:50" },
  { action: "Responded to INC-037: Queue buildup", time: "14:30" },
  { action: "Shift started", time: "14:00" },
];

export default function VolunteerProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <UserCircle2 size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Arjun Kumar</h2>
            <p className="text-sm text-slate-400">Volunteer — ID: VOL-007</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={12} /> Zone B</span>
              <span className="flex items-center gap-1"><Globe size={12} /> English, Hindi</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">● Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-teal-500" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-sm">Recent Activity</h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {recentActivity.map((item) => (
            <div key={item.id || item.action} className="px-5 py-3 flex items-center justify-between">
              <span className="text-sm">{item.action}</span>
              <span className="text-xs text-slate-400 font-mono shrink-0 ml-4">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
