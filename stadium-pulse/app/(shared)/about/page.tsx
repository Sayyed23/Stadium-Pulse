import { Zap, ShieldCheck, Radio, Leaf } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="text-center space-y-3">
        <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-xl tracking-tighter">
            SP
          </span>
        </div>
        <h2 className="text-3xl font-bold">About StadiumPulse AI</h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          GenAI-enabled operations layer and tournament companion platform built
          for large-scale sports venues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="glass-panel rounded-xl p-5 space-y-2">
          <Zap className="text-blue-500" size={24} />
          <h3 className="font-semibold text-base">
            Multilingual AI Navigation
          </h3>
          <p className="text-xs text-slate-400">
            Step-by-step route sequences constrained strictly to pre-fetched
            database facts with zero hallucinated directions.
          </p>
        </div>
        <div className="glass-panel rounded-xl p-5 space-y-2">
          <Radio className="text-emerald-500" size={24} />
          <h3 className="font-semibold text-base">Real-Time Event Stream</h3>
          <p className="text-xs text-slate-400">
            Unified Server-Sent Events bus streaming live zone occupancy,
            threshold breaches, and transport capacity.
          </p>
        </div>
        <div className="glass-panel rounded-xl p-5 space-y-2">
          <ShieldCheck className="text-purple-500" size={24} />
          <h3 className="font-semibold text-base">
            Volunteer Incident Copilot
          </h3>
          <p className="text-xs text-slate-400">
            Two-panel workspace extracting unstructured incident reports and
            matching nearest volunteers with localized dispatch messaging.
          </p>
        </div>
        <div className="glass-panel rounded-xl p-5 space-y-2">
          <Leaf className="text-teal-500" size={24} />
          <h3 className="font-semibold text-base">
            Sustainability & Transport
          </h3>
          <p className="text-xs text-slate-400">
            Real-time waste bin fill monitoring and crowd transport nudges to
            optimize stadium throughput.
          </p>
        </div>
      </div>
    </div>
  );
}
