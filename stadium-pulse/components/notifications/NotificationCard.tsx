"use client";

import { Clock, ShieldAlert, Bus, CloudRain, Bell } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "security" | "transport" | "weather" | "general" | "alert" | "info" | "update";
  read: boolean;
}

const typeConfig = {
  security: {
    icon: ShieldAlert,
    badge: "bg-red-500/10 text-red-400 border border-red-500/30",
  },
  alert: {
    icon: ShieldAlert,
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  },
  transport: {
    icon: Bus,
    badge: "bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30",
  },
  weather: {
    icon: CloudRain,
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  },
  info: {
    icon: Bell,
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  },
  update: {
    icon: Bus,
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  },
  general: {
    icon: Bell,
    badge: "bg-slate-500/10 text-slate-400 border border-slate-500/30",
  },
};

interface NotificationCardProps {
  readonly notification: NotificationItem;
  readonly isUnread?: boolean;
}

export function NotificationCard({ notification, isUnread = false }: NotificationCardProps) {
  const config = typeConfig[notification.type];
  const Icon = config.icon;

  if (isUnread) {
    return (
      <div
        className="bg-[#1d2022] border-l-4 border-l-[#00f2ff] border border-[#3a494b]/40 rounded-2xl p-4 shadow-xl cursor-pointer hover:border-[#00f2ff]/40 transition-all"
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.badge}`}>
            <Icon size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-xs font-bold text-white truncate">{notification.title}</span>
              <span className="text-[10px] font-mono text-[#00f2ff] shrink-0 flex items-center gap-1">
                <Clock size={10} />
                {notification.time}
              </span>
            </div>
            <p className="text-xs text-[#b9cacb] leading-relaxed">{notification.body}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#1d2022]/60 border border-[#3a494b]/30 rounded-xl p-3.5 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.badge}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-xs font-semibold text-white truncate">{notification.title}</span>
            <span className="text-[10px] font-mono text-[#b9cacb] shrink-0">{notification.time}</span>
          </div>
          <p className="text-xs text-[#b9cacb] leading-relaxed">{notification.body}</p>
        </div>
      </div>
    </div>
  );
}
