import Link from "next/link";
import { AlertTriangle, Info, CheckCircle2, Clock, ArrowLeft } from "lucide-react";

const notifications = [
  { id: "1", type: "alert", title: "Zone B Near Capacity", body: "Zone B is at 91% occupancy. Consider using alternate routes via Gate 7.", time: "2 min ago", read: false },
  { id: "2", type: "info", title: "Half-Time Break in 15 minutes", body: "Food courts will be busy. Pre-order now to skip the queue.", time: "10 min ago", read: false },
  { id: "3", type: "update", title: "Shuttle Bay A Now Available", body: "New shuttle service to Metro Station has started. Next departure in 5 minutes.", time: "25 min ago", read: false },
  { id: "4", type: "alert", title: "Restroom C3 Closed", body: "Restroom C3 in Zone C is temporarily closed for maintenance. Use Restroom C1 instead.", time: "45 min ago", read: true },
  { id: "5", type: "info", title: "Welcome to the Stadium!", body: "Enjoy the match! Use the AI Assistant for navigation help in English, Hindi, or Marathi.", time: "1 hr ago", read: true },
  { id: "6", type: "update", title: "Gates Open", body: "All gates are now open for entry. Show your ticket QR code at the gate scanner.", time: "2 hrs ago", read: true },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
  alert: { icon: AlertTriangle, color: "text-amber-400", badge: "bg-amber-500/10 text-amber-400" },
  info: { icon: Info, color: "text-blue-400", badge: "bg-blue-500/10 text-blue-400" },
  update: { icon: CheckCircle2, color: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400" },
};

export default function NotificationsPage() {
  const unread = notifications.filter((n) => !n.read);
  const read = notifications.filter((n) => n.read);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 font-sans space-y-6">
      <Link href="/fan" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
        <ArrowLeft size={14} /> Back to Fan Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Notifications Center</h2>
          <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">{unread.length} new unread updates</p>
        </div>
        <button type="button" className="text-xs font-mono font-bold text-[#00f2ff] hover:underline">Mark all read</button>
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <section>
          <h3 className="text-xs font-mono font-bold text-[#00f2ff] uppercase tracking-wider mb-2 px-1">New System Alerts</h3>
          <div className="space-y-2.5">
            {unread.map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;
              return (
                <div key={n.id} className="bg-[#1d2022] border-l-4 border-l-[#00f2ff] border border-[#3a494b]/40 rounded-2xl p-4 shadow-xl cursor-pointer hover:border-[#00f2ff]/40 transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.badge}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-bold text-white truncate">{n.title}</span>
                        <span className="text-[10px] font-mono text-[#00f2ff] shrink-0 flex items-center gap-1"><Clock size={10} />{n.time}</span>
                      </div>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">{n.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Read */}
      {read.length > 0 && (
        <section>
          <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-2 px-1">Earlier Notifications</h3>
          <div className="space-y-2">
            {read.map((n) => {
              const config = typeConfig[n.type];
              const Icon = config.icon;
              return (
                <div key={n.id} className="bg-[#1d2022]/60 border border-[#3a494b]/30 rounded-xl p-3.5 opacity-70 cursor-pointer hover:opacity-100 transition-opacity">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${config.badge}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-white truncate">{n.title}</span>
                        <span className="text-[10px] font-mono text-[#b9cacb] shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#b9cacb] leading-relaxed">{n.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
