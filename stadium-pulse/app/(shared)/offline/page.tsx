"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <WifiOff size={32} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">You are offline</h2>
        <p className="text-sm text-slate-400 max-w-sm mt-1">
           stadium data and offline maps remain accessible. Reconnect to resume live updates.
        </p>
      </div>
      <button type="button"
        onClick={() => typeof window !== "undefined" && window.location.reload()}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
      >
        <RefreshCw size={16} /> Retry Connection
      </button>
    </div>
  );
}
