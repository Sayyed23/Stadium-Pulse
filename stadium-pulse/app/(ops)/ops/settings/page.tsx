"use client";

import { useState } from "react";
import { Settings, Bell, Activity, Save } from "lucide-react";

function ToggleButton({ value, onChange, ariaLabel }: { value: boolean; onChange: (v: boolean) => void; ariaLabel: string }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative focus-visible:ring-2 focus-visible:ring-blue-500 ${value ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function OpsSettingsPage() {
  const [warningThreshold, setWarningThreshold] = useState(85);
  const [criticalThreshold, setCriticalThreshold] = useState(95);
  const [cooldownSec, setCooldownSec] = useState(60);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-3xl font-bold">Settings</h2>

      {/* Alert Thresholds */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-500" /> Alert Thresholds</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="warning-slider" className="text-sm font-medium">Warning Threshold</label>
              <span className="text-sm font-bold text-amber-500" aria-hidden="true">{warningThreshold}%</span>
            </div>
            <input id="warning-slider" type="range" min={50} max={95} value={warningThreshold} onChange={(e) => setWarningThreshold(Number(e.target.value))}
              aria-valuemin={50} aria-valuemax={95} aria-valuenow={warningThreshold} aria-label="Warning Threshold Percentage"
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="critical-slider" className="text-sm font-medium">Critical Threshold</label>
              <span className="text-sm font-bold text-red-500" aria-hidden="true">{criticalThreshold}%</span>
            </div>
            <input id="critical-slider" type="range" min={80} max={100} value={criticalThreshold} onChange={(e) => setCriticalThreshold(Number(e.target.value))}
              aria-valuemin={80} aria-valuemax={100} aria-valuenow={criticalThreshold} aria-label="Critical Threshold Percentage"
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="cooldown-slider" className="text-sm font-medium">Anti-Spam Cooldown</label>
              <span className="text-sm font-bold" aria-hidden="true">{cooldownSec}s</span>
            </div>
            <input id="cooldown-slider" type="range" min={15} max={180} value={cooldownSec} onChange={(e) => setCooldownSec(Number(e.target.value))}
              aria-valuemin={15} aria-valuemax={180} aria-valuenow={cooldownSec} aria-label="Anti-Spam Cooldown in Seconds"
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Bell size={18} className="text-amber-500" /> Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Push Notifications</div>
              <div className="text-xs text-zinc-400">Browser push for threshold alerts</div>
            </div>
            <ToggleButton value={pushEnabled} onChange={setPushEnabled} ariaLabel="Toggle Push Notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Email Notifications</div>
              <div className="text-xs text-zinc-400">Daily summary and critical alerts</div>
            </div>
            <ToggleButton value={emailEnabled} onChange={setEmailEnabled} ariaLabel="Toggle Email Notifications" />
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><Settings size={18} className="text-slate-400" /> System</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500">App Version</span><span className="font-mono">v0.1.0</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500">SSE Status</span><span className="text-emerald-500 font-medium">Connected</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-zinc-500">Database</span><span className="text-emerald-500 font-medium">Healthy</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-zinc-500">Rate Limiter</span><span className="font-medium">Upstash Redis</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <Save size={18} />
        Save Settings
      </button>
    </div>
  );
}
