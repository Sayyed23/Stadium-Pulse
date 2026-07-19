"use client";

import {
  ListChecks,
  AlertTriangle,
  Radio,
  Bell,
  Bot,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import { MOCK_VOLUNTEER_TASKS as tasks } from "@/lib/mock-data";


const incidents = [
  {
    id: "INC-042",
    category: "medical",
    zone: "Zone B",
    priority: "critical",
    status: "assigned",
    time: "3 min ago",
  },
  {
    id: "INC-041",
    category: "crowd_control",
    zone: "Zone A",
    priority: "high",
    status: "open",
    time: "12 min ago",
  },
];

const notifications = [
  { title: "New task assigned: Gate 3 wheelchair assist", time: "2 min ago" },
  { title: "Incident INC-042 escalated to critical", time: "5 min ago" },
  { title: "Shift starts in 15 minutes", time: "30 min ago" },
];

const priorityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400",
  high: "bg-amber-500/10 text-amber-400",
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-slate-500/10 text-slate-400",
};

export default function VolunteerDashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Volunteer Operations Dashboard
          </h2>
          <p className="text-xs text-[#b9cacb] mt-1 font-mono">
            Duty Sector: Sector 4 (North Concourse) · 3 Active Tasks
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5cf968]/10 text-[#5cf968] border border-[#5cf968]/30 text-xs font-mono font-bold shadow-lg">
          <Radio size={14} className="animate-pulse" />
          DUTY ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Tasks */}
        <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#3a494b]/30">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ListChecks size={16} className="text-[#00f2ff]" /> Assigned Duty
              Tasks
            </h3>
            <Link
              href="/volunteer/tasks"
              className="text-xs font-mono font-bold text-[#00f2ff] hover:underline"
            >
              View All Tasks
            </Link>
          </div>
          <div className="divide-y divide-[#3a494b]/30">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="px-5 py-3.5 hover:bg-[#272a2c] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    {task.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${priorityColors[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#b9cacb]">
                  <span className="flex items-center gap-1 text-[#00f2ff]">
                    <MapPin size={10} />
                    {task.zone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    Due {task.due}
                  </span>
                  <span
                    className={`font-bold ${task.status === "in-progress" ? "text-[#00f2ff]" : "text-[#b9cacb]"}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#3a494b]/30">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" /> Active
              Incidents
            </h3>
            <Link
              href="/volunteer/incidents"
              className="text-xs font-mono font-bold text-[#00f2ff] hover:underline"
            >
              View All Incidents
            </Link>
          </div>
          <div className="divide-y divide-[#3a494b]/30">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="px-5 py-3.5 hover:bg-[#272a2c] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    {inc.id} — {inc.category.replace("_", " ")}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${priorityColors[inc.priority]}`}
                  >
                    {inc.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#b9cacb]">
                  <span className="flex items-center gap-1 text-[#00f2ff]">
                    <MapPin size={10} />
                    {inc.zone}
                  </span>
                  <span>{inc.time}</span>
                  <span
                    className={`font-bold ${inc.status === "assigned" ? "text-[#5cf968]" : "text-amber-400"}`}
                  >
                    {inc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#3a494b]/30">
            <Bell size={16} className="text-[#00f2ff]" />
            <h3 className="font-bold text-sm text-white">Broadcast Alerts</h3>
          </div>
          <div className="divide-y divide-[#3a494b]/30">
            {notifications.map((n) => (
              <div key={n.title} className="px-5 py-3 text-xs">
                <div className="font-bold text-white mb-0.5">{n.title}</div>
                <div className="text-[10px] font-mono text-[#b9cacb]">
                  {n.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Copilot Quick Access */}
        <Link
          href="/volunteer/copilot"
          className="bg-[#1d2022] border border-[#00f2ff]/30 rounded-2xl p-5 flex items-center gap-4 hover:border-[#00f2ff] transition-all group shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 flex items-center justify-center shrink-0">
            <Bot size={26} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm text-white">
              AI Incident Copilot
            </div>
            <div className="text-xs text-[#b9cacb]">
              Report incidents with voice & automated priority scoring
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-[#00f2ff] group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
}
