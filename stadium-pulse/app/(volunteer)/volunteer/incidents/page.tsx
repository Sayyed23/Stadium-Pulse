"use client";

import { useState } from "react";
import { AlertTriangle, MapPin, Clock, User } from "lucide-react";

type Tab = "open" | "assigned" | "completed";

const incidents = [
  { id: "INC-042", category: "medical", zone: "Zone B", priority: "critical", status: "assigned", assignee: "You", time: "3 min ago", description: "Person collapsed in concourse" },
  { id: "INC-041", category: "crowd_control", zone: "Zone A", priority: "high", status: "open", assignee: null, time: "12 min ago", description: "Overcrowding near Gate 2" },
  { id: "INC-040", category: "security", zone: "Zone C", priority: "medium", status: "open", assignee: null, time: "25 min ago", description: "Unattended bag reported" },
  { id: "INC-039", category: "facilities", zone: "Zone D", priority: "low", status: "assigned", assignee: "Arjun K.", time: "40 min ago", description: "Water leak near restroom D1" },
  { id: "INC-038", category: "medical", zone: "Zone A", priority: "high", status: "completed", assignee: "Meena P.", time: "1 hr ago", description: "Minor injury — first aid provided" },
  { id: "INC-037", category: "crowd_control", zone: "Zone B", priority: "medium", status: "completed", assignee: "You", time: "1.5 hrs ago", description: "Queue buildup at food court" },
];

const priorityColors: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  low: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export default function VolunteerIncidentsPage() {
  const [tab, setTab] = useState<Tab>("open");

  const filtered = incidents.filter((i) => {
    if (tab === "open") return i.status === "open";
    if (tab === "assigned") return i.status === "assigned";
    return i.status === "completed";
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "open", label: "Open", count: incidents.filter((i) => i.status === "open").length },
    { key: "assigned", label: "Assigned", count: incidents.filter((i) => i.status === "assigned").length },
    { key: "completed", label: "Completed", count: incidents.filter((i) => i.status === "completed").length },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button type="button"
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key
                ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
            No {tab} incidents.
          </div>
        ) : (
          filtered.map((inc) => (
            <div key={inc.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-zinc-600 dark:text-zinc-300">{inc.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${priorityColors[inc.priority]}`}>{inc.priority}</span>
                </div>
                <span className="text-xs text-zinc-400 flex items-center gap-1"><Clock size={10} />{inc.time}</span>
              </div>
              <p className="text-sm font-medium mb-2">{inc.description}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1"><AlertTriangle size={10} />{inc.category.replace("_", " ")}</span>
                <span className="flex items-center gap-1"><MapPin size={10} />{inc.zone}</span>
                {inc.assignee && <span className="flex items-center gap-1"><User size={10} />{inc.assignee}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
