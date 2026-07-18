import { Accessibility, Navigation, ArrowUp, Armchair, Headphones, HandHelping, MapPin, Phone } from "lucide-react";

const wheelchairRoutes = [
  { from: "Gate 1", to: "Section A (Accessible)", via: "Ramp + Lift 2", time: "6 min" },
  { from: "Gate 3", to: "Section C (Accessible)", via: "Ground Level", time: "4 min" },
  { from: "Parking P1", to: "Gate 1 (Accessible)", via: "Covered Walkway", time: "8 min" },
];

const elevators = [
  { name: "Lift 1 — Gate 1", floors: "G, 1, 2", status: "operational" },
  { name: "Lift 2 — North Stand", floors: "G, 1, 2, 3", status: "operational" },
  { name: "Lift 3 — South Stand", floors: "G, 1, 2", status: "maintenance" },
  { name: "Lift 4 — East Wing", floors: "G, 1", status: "operational" },
];

const accessibleSeating = [
  { section: "Section A — Row 1-3", type: "Wheelchair Spaces", count: 24, available: 8 },
  { section: "Section C — Row 1-2", type: "Wheelchair Spaces", count: 16, available: 3 },
  { section: "Section B — Row 5", type: "Companion Seats", count: 12, available: 5 },
  { section: "VIP Box 2", type: "Accessible Suite", count: 4, available: 1 },
];

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col gap-6 p-4 pb-28 max-w-lg mx-auto font-sans">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Accessibility className="text-[#00f2ff]" size={26} />
          Accessibility Services
        </h2>
        <p className="text-xs text-[#b9cacb]">Accessible routes, elevators, seating & dedicated volunteer support</p>
      </div>

      {/* Quick Action — Request Assistance */}
      <button className="w-full bg-[#1d2022] border border-[#00f2ff]/40 text-white rounded-2xl p-4 flex items-center gap-4 hover:border-[#00f2ff] transition-all shadow-xl active:scale-[0.98]">
        <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 flex items-center justify-center shrink-0">
          <HandHelping size={24} />
        </div>
        <div className="text-left">
          <div className="font-bold text-sm text-white">Request Live Assistance</div>
          <div className="text-xs text-[#00f2ff]">Dispatch a dedicated volunteer to your location</div>
        </div>
      </button>

      {/* Wheelchair Routes */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#00f2ff] uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Navigation size={14} />
          Wheelchair Routes
        </h3>
        <div className="space-y-2">
          {wheelchairRoutes.map((route) => (
            <div key={route.from + route.to} className="bg-[#1d2022] border border-[#3a494b]/40 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 px-2 py-0.5 rounded">{route.from}</span>
                <span className="text-[#b9cacb]">→</span>
                <span className="text-xs font-mono font-bold bg-[#5cf968]/10 text-[#5cf968] border border-[#5cf968]/20 px-2 py-0.5 rounded">{route.to}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#b9cacb]">
                <span>Via: {route.via}</span>
                <span>·</span>
                <span className="text-[#00f2ff]">~{route.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elevators */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <ArrowUp size={14} />
          Accessible Elevators
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {elevators.map((lift) => (
            <div key={lift.name} className="bg-[#1d2022] border border-[#3a494b]/40 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white truncate">{lift.name}</span>
                <div className={`w-2 h-2 rounded-full ${lift.status === "operational" ? "bg-[#5cf968] animate-pulse" : "bg-red-500"}`} />
              </div>
              <div className="text-[11px] font-mono text-[#b9cacb]">Floors: {lift.floors}</div>
              {lift.status === "maintenance" && (
                <div className="text-[10px] text-red-400 font-mono font-bold mt-1">Maintenance</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Accessible Seating */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Armchair size={14} />
          Accessible Seating Availability
        </h3>
        <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl divide-y divide-[#3a494b]/30 overflow-hidden">
          {accessibleSeating.map((seat) => (
            <div key={seat.section} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <div className="text-xs font-bold text-white">{seat.section}</div>
                <div className="text-[11px] text-[#b9cacb] font-mono">{seat.type}</div>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-[#5cf968]">{seat.available}</div>
                <div className="text-[10px] text-[#b9cacb]">of {seat.count} open</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hearing Assistance */}
      <section>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Headphones size={14} />
          Hearing Assistance
        </h3>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-sm mb-3">Hearing loop systems are available in all main seating areas. Portable receivers can be collected from:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Guest Services — Gate 1 (Ground Floor)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-blue-500 shrink-0" />
              <span>Accessibility Desk — Gate 5 (Level 1)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-blue-500 shrink-0" />
              <span>Pre-book: +91 22 1234 5678</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
