import { MapPin, Navigation as NavIcon } from "lucide-react";

export default function VolunteerNavigationPage() {
  return (
    <div className="space-y-6">
      {/* Map Area */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
          {/* Zone overlays showing assigned zones highlighted */}
          <div className="absolute inset-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl" />
          <div className="absolute top-8 left-8 px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-500/30 text-xs font-bold text-teal-400">
            Zone B (Assigned)
          </div>
          <div className="absolute top-8 right-8 px-3 py-1.5 rounded-lg bg-slate-500/20 text-xs font-semibold text-slate-400">Zone A</div>
          <div className="absolute bottom-8 left-8 px-3 py-1.5 rounded-lg bg-slate-500/20 text-xs font-semibold text-slate-400">Zone C</div>
          <div className="absolute bottom-8 right-8 px-3 py-1.5 rounded-lg bg-slate-500/20 text-xs font-semibold text-slate-400">Zone D</div>
          <div className="text-center">
            <NavIcon size={32} className="text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">Indoor Navigation</p>
            <p className="text-xs text-slate-400 mt-1">Your assigned zones are highlighted</p>
          </div>
        </div>
      </div>

      {/* Quick Routes */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold text-sm flex items-center gap-2"><MapPin size={16} className="text-teal-500" /> Quick Routes</h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {[
            { to: "Incident INC-042 Location", zone: "Zone B", time: "2 min" },
            { to: "First Aid Cabinet #4", zone: "Gate 5", time: "3 min" },
            { to: "Gate 3 — Wheelchair Assist", zone: "Zone A", time: "5 min" },
            { to: "Water Station 2", zone: "Zone C", time: "4 min" },
          ].map((route) => (
            <div key={route.to} className="px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{route.to}</div>
                <div className="text-xs text-zinc-400">{route.zone}</div>
              </div>
              <span className="text-xs font-medium text-teal-500">~{route.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
