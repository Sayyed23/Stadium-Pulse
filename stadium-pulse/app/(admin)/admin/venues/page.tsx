import Link from "next/link";
import { Building2, MapPin, Plus, Edit, Trash2, ArrowLeft } from "lucide-react";

const venues = [
  { id: "v1", name: "Mumbai Cricket Stadium", city: "Mumbai", capacity: 33000, zones: 8, status: "active" },
  { id: "v2", name: "Delhi Sports Complex", city: "New Delhi", capacity: 45000, zones: 12, status: "draft" },
];

export default function VenuesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans p-4">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
        <ArrowLeft size={14} /> Back to Admin Governance
      </Link>

      <div className="bg-[#1d2022] border border-[#3a494b]/40 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="text-[#00f2ff]" size={26} /> Venue & Seating Management
          </h2>
          <p className="text-xs sm:text-sm text-[#b9cacb] font-mono mt-1">Configure seating capacities, zone polygon boundaries & tournament schedules</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] text-xs font-mono font-extrabold uppercase transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]">
          <Plus size={16} /> Add Venue
        </button>
      </div>

      <div className="bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-[#3a494b]/40 text-xs font-mono text-[#00f2ff] uppercase">
              <th className="py-3 px-5">Venue</th>
              <th className="py-3 px-5">City</th>
              <th className="py-3 px-5">Capacity</th>
              <th className="py-3 px-5">Zones</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#3a494b]/20 text-xs text-[#e0e3e5]">
            {venues.map((v) => (
              <tr key={v.id} className="hover:bg-[#272a2c] transition-colors">
                <td className="py-3.5 px-5 font-bold flex items-center gap-2 text-white"><Building2 size={14} className="text-[#00f2ff]" />{v.name}</td>
                <td className="py-3.5 px-5 text-[#b9cacb] font-mono flex items-center gap-1"><MapPin size={12} />{v.city}</td>
                <td className="py-3.5 px-5 font-mono">{v.capacity.toLocaleString()}</td>
                <td className="py-3.5 px-5 font-mono">{v.zones}</td>
                <td className="py-3.5 px-5"><span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${v.status === "active" ? "bg-[#5cf968]/10 text-[#5cf968] border border-[#5cf968]/30" : "bg-[#3a494b]/30 text-[#b9cacb]"}`}>{v.status}</span></td>
                <td className="py-3.5 px-5 flex items-center gap-2">
                  <button className="p-1.5 rounded-lg bg-[#101415] hover:border-[#00f2ff] border border-[#3a494b] text-[#b9cacb] hover:text-white transition-colors"><Edit size={14} /></button>
                  <button className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
