import Link from "next/link";
import { ShieldAlert, Cross, Shield, Search, Phone, AlertTriangle, ArrowLeft } from "lucide-react";

const emergencyContacts = [
  { name: "Stadium Security", number: "+91 22 1234 0001", available: "24/7" },
  { name: "Medical Center", number: "+91 22 1234 0002", available: "During events" },
  { name: "Police Control Room", number: "100", available: "24/7" },
  { name: "Ambulance", number: "108", available: "24/7" },
  { name: "Fire Department", number: "101", available: "24/7" },
];

export default function EmergencyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12 font-sans space-y-6">
      <Link href="/fan" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
        <ArrowLeft size={14} /> Back to Fan Dashboard
      </Link>

      <div className="bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="text-red-400" size={30} />
          Emergency SOS Response
        </h2>
        <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">Instant 1-Tap geolocation dispatch to Control Room & Security Desk</p>
      </div>

      {/* SOS Button */}
      <button type="button" className="relative w-full py-9 rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white font-extrabold text-2xl tracking-wider flex flex-col items-center justify-center gap-2 shadow-[0_0_35px_rgba(239,68,68,0.4)] border border-red-500/50 hover:scale-[1.02] transition-all active:scale-95 overflow-hidden group">
        <div className="flex items-center gap-3">
          <ShieldAlert size={34} className="animate-bounce text-white" />
          <span>1-TAP EMERGENCY SOS</span>
        </div>
        <span className="text-xs font-mono text-red-200 font-normal">Broadcasts live GPS coordinates to Command Desk</span>
      </button>

      {/* Help Categories */}
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="bg-[#1d2022] border border-red-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-red-500 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <Cross size={26} />
          </div>
          <div className="text-center">
            <div className="font-bold text-xs text-white">Medical First Aid</div>
            <div className="text-[10px] text-[#b9cacb] mt-0.5">Paramedic dispatch</div>
          </div>
        </button>

        <button type="button" className="bg-[#1d2022] border border-[#00f2ff]/30 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-[#00f2ff] transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 text-[#00f2ff] flex items-center justify-center">
            <Shield size={26} />
          </div>
          <div className="text-center">
            <div className="font-bold text-xs text-white">Stadium Security</div>
            <div className="text-[10px] text-[#b9cacb] mt-0.5">Report security event</div>
          </div>
        </button>

        <button type="button" className="bg-[#1d2022] border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-amber-500 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Search size={26} />
          </div>
          <div className="text-center">
            <div className="font-bold text-xs text-white">Lost & Found</div>
            <div className="text-[10px] text-[#b9cacb] mt-0.5">Missing items or child</div>
          </div>
        </button>

        <button type="button" className="bg-[#1d2022] border border-purple-500/30 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-purple-500 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <AlertTriangle size={26} />
          </div>
          <div className="text-center">
            <div className="font-bold text-xs text-white">Facility Hazard</div>
            <div className="text-[10px] text-[#b9cacb] mt-0.5">Spills, structural damage</div>
          </div>
        </button>
      </div>

      {/* Emergency Contacts */}
      <section>
        <h3 className="text-xs font-mono font-semibold text-[#b9cacb] uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
          <Phone size={14} />
          Direct Dispatch Hotlines
        </h3>
        <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl divide-y divide-[#3a494b]/30 overflow-hidden">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.name}
              href={`tel:${contact.number.replace(/\s/g, "")}`}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-[#272a2c] transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-white">{contact.name}</div>
                <div className="text-[10px] text-[#b9cacb] font-mono">{contact.available}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#00f2ff]">{contact.number}</span>
                <Phone size={14} className="text-[#00f2ff]" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
