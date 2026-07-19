import { Bell, Clock } from "lucide-react";

export default function SharedNotificationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">All System Notifications</h2>
        <span className="text-xs text-slate-400">Live Updates</span>
      </div>

      <div className="space-y-3">
        {[
          { title: "Match Kickoff in 30 minutes", desc: "Please reach your assigned seats in Zone A / Zone B.", time: "15m ago" },
          { title: "Weather Update", desc: "Clear skies expected throughout the match duration.", time: "1h ago" },
          { title: "Gate 5 Access Opened", desc: "Additional turnstiles operational at Gate 5 for faster entry.", time: "2h ago" },
        ].map((item) => (
          <div key={n.id || n.title} className="glass-panel rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Bell size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5">{item.title}</div>
              <p className="text-xs text-slate-400 mb-1">{item.desc}</p>
              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10} />{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
