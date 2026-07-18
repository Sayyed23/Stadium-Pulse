import { Settings, Save, Database, Cpu, Radio, ShieldCheck } from "lucide-react";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-3xl font-bold">System Settings</h2>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Database size={18} className="text-violet-500" /> Database & Persistence
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">ORM Engine</div>
            <div className="font-semibold font-mono">Prisma v5.22.0</div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">PostgreSQL Connection</div>
            <div className="font-semibold text-emerald-400">Supabase Connected</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Cpu size={18} className="text-violet-500" /> LLM Orchestration & Guardrails
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">Default Gemini Model</div>
            <div className="font-semibold font-mono">gemini-1.5-flash</div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">Strict Grounding Verification</div>
            <div className="font-semibold text-emerald-400">ENABLED (Active)</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Radio size={18} className="text-violet-500" /> Event Bus Protocol
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">Protocol</div>
            <div className="font-semibold">Server-Sent Events (SSE)</div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 mb-1">Stream Endpoint</div>
            <div className="font-semibold font-mono text-xs">/api/zones/stream</div>
          </div>
        </div>
      </div>

      <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <Save size={18} /> Save Global System Settings
      </button>
    </div>
  );
}
