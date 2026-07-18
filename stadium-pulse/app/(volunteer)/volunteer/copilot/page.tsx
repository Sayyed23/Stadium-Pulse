"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Send, AlertTriangle, MapPin, User, CheckCircle2, ArrowLeft } from "lucide-react";

export default function VolunteerCopilotPage() {
  const [description, setDescription] = useState("");
  const [hasDraft, setHasDraft] = useState(false);

  const handleExtract = () => {
    if (description.trim()) setHasDraft(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-6xl mx-auto font-sans p-4 space-y-4">
      <Link href="/volunteer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#00f2ff] hover:underline">
        <ArrowLeft size={14} /> Back to Volunteer Dashboard
      </Link>
      
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Panel: Report */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-[#3a494b]/30">
            <h3 className="font-bold text-sm text-white flex items-center gap-2"><Bot size={18} className="text-[#00f2ff]" /> AI Voice/Text Incident Intake</h3>
          </div>
          <div className="flex-1 p-5 flex flex-col">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident in detail... (e.g. 'Guest slipped near Gate 12, medical attention needed immediately')"
              className="flex-1 w-full bg-[#101415] border border-[#3a494b] rounded-xl p-4 text-xs text-[#e0e3e5] placeholder:text-[#b9cacb]/60 resize-none focus:outline-none focus:border-[#00f2ff]"
            />
            <button
              onClick={handleExtract}
              className="mt-4 w-full bg-[#00f2ff] hover:bg-[#74f5ff] text-[#00363a] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] text-xs font-mono uppercase"
            >
              <Bot size={18} />
              AI Extract & Structure Ticket
            </button>
          </div>
        </div>

        {/* Right Panel: Draft */}
        <div className="flex-1 bg-[#1d2022] border border-[#3a494b]/40 rounded-2xl p-6 overflow-y-auto flex flex-col shadow-2xl">
          <h3 className="text-sm font-mono font-bold text-[#00f2ff] uppercase tracking-wider mb-4 border-b border-[#3a494b]/30 pb-3">Structured Ticket Preview</h3>

          {hasDraft ? (
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                  <div className="text-[10px] font-mono text-[#b9cacb] uppercase mb-1">Category</div>
                  <div className="font-bold text-xs text-white capitalize">Medical First Aid</div>
                </div>
                <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                  <div className="text-[10px] font-mono text-[#b9cacb] uppercase mb-1">AI Assessed Priority</div>
                  <div className="font-bold text-xs text-red-400 capitalize flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-red-400" /> High Priority
                  </div>
                </div>
              </div>

              <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                <div className="text-[10px] font-mono text-[#b9cacb] uppercase mb-1 flex items-center gap-1"><MapPin size={12} className="text-[#00f2ff]" /> Tagged Sector</div>
                <div className="font-bold text-xs text-white">Zone A — North Concourse Gate 12</div>
              </div>

              <div className="bg-[#101415] p-3 rounded-xl border border-[#3a494b]/40">
                <div className="text-[10px] font-mono text-[#b9cacb] uppercase mb-1">AI Extracted Summary</div>
                <p className="text-xs text-[#e0e3e5]">Fan slipped on wet surface near Gate 12 food court. Requires immediate first aid assessment.</p>
              </div>

              <div className="border border-[#5cf968]/30 bg-[#5cf968]/5 p-4 rounded-xl space-y-2">
                <h4 className="font-mono font-bold text-xs text-[#5cf968] flex items-center gap-2">
                  <User size={16} /> Recommended Volunteer
                </h4>
                <div className="text-xs font-mono text-[#b9cacb] space-y-1">
                  <p><span className="text-[#b9cacb]">Volunteer:</span> Meena Patel (ID: V-102)</p>
                  <p><span className="text-[#b9cacb]">Duty Sector:</span> Zone A (15m distance)</p>
                  <p><span className="text-[#b9cacb]">Language:</span> Hindi / English</p>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button className="w-full bg-[#5cf968] hover:bg-[#70ff76] text-[#00390a] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(92,249,104,0.3)] text-xs font-mono uppercase">
                  <CheckCircle2 size={18} />
                  Confirm & Dispatch Volunteer
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#b9cacb] text-center space-y-3">
              <div className="p-4 rounded-2xl bg-[#101415] border border-[#3a494b]">
                <Bot size={36} className="text-[#00f2ff]" />
              </div>
              <p className="text-xs max-w-xs font-mono">Input description on the left to activate AI Copilot ticket structure & automated dispatch recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
