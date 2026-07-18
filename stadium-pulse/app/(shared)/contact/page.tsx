"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactSupportPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-1">Contact Support</h2>
        <p className="text-sm text-slate-400">Reach out to the StadiumPulse AI operations team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 text-center">
          <Mail size={20} className="text-blue-500 mx-auto mb-2" />
          <div className="text-xs font-semibold">Email</div>
          <div className="text-xs text-slate-400 mt-1">support@stadiumpulse.ai</div>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <Phone size={20} className="text-emerald-500 mx-auto mb-2" />
          <div className="text-xs font-semibold">Helpline</div>
          <div className="text-xs text-slate-400 mt-1">+91 22 1234 5678</div>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <MapPin size={20} className="text-purple-500 mx-auto mb-2" />
          <div className="text-xs font-semibold">Location</div>
          <div className="text-xs text-slate-400 mt-1">Control Room 2, Gate 1</div>
        </div>
      </div>

      <form className="glass-panel rounded-2xl p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <h3 className="font-semibold text-base">Send Us a Message</h3>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Subject</label>
          <input type="text" placeholder="e.g. Lost item query, Feedback" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Message</label>
          <textarea rows={4} placeholder="Describe your query..." className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Send size={16} /> Submit Query
        </button>
      </form>
    </div>
  );
}
