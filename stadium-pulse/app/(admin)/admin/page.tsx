import {
  Building2,
  CalendarDays,
  Users,
  AlertTriangle,
  BarChart3,
  Activity,
  Bot,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Active Venues",
    value: "1",
    icon: Building2,
    color: "text-violet-400",
  },
  {
    label: "Active Events",
    value: "3",
    icon: CalendarDays,
    color: "text-blue-400",
  },
  {
    label: "Total Users",
    value: "12,847",
    icon: Users,
    color: "text-emerald-400",
  },
  {
    label: "Open Incidents",
    value: "4",
    icon: AlertTriangle,
    color: "text-amber-400",
  },
];

const quickActions = [
  { label: "Manage Venues", href: "/admin/venues", icon: Building2 },
  { label: "Manage Events", href: "/admin/events", icon: CalendarDays },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "AI Prompts", href: "/admin/prompts", icon: Bot },
  { label: "View Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/audit", icon: Activity },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Admin Operations & Platform Governance
          </h2>
          <p className="text-xs text-[#b9cacb] mt-1 font-mono">
            System Config, Multi-Venue Control & GenAI Grounding
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-xs font-mono font-bold">
          ADMIN LEVEL 4
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-5 shadow-xl space-y-1"
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={s.color} />
                <span className="text-[10px] font-mono text-[#b9cacb] uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
              <p className={`text-3xl font-extrabold font-mono ${s.color}`}>
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-5 flex items-center gap-4 hover:border-[#00f2ff]/40 transition-all group shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center group-hover:bg-[#00f2ff]/20 transition-colors">
                <Icon size={22} className="text-[#00f2ff]" />
              </div>
              <span className="font-bold text-xs text-white group-hover:text-[#00f2ff] transition-colors">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
