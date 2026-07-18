import { UserCircle2, Mail, Phone, MapPin, Globe, Shield, Edit } from "lucide-react";

export default function SharedProfilePage() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <UserCircle2 size={44} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Alex Spectator</h2>
            <p className="text-sm text-slate-400">Fan Pass ID: #SP-88219</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Match Day Ticket Holder</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-lg border-b border-slate-200 dark:border-slate-800 pb-2">Personal Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2"><Mail size={16} /> Email</span>
            <span>alex.fan@example.com</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2"><Phone size={16} /> Mobile</span>
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2"><MapPin size={16} /> Ticket Stand</span>
            <span>Zone A — North Stand (Section 12, Row 4)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2"><Globe size={16} /> Preferred Language</span>
            <span>English</span>
          </div>
        </div>
      </div>
    </div>
  );
}
