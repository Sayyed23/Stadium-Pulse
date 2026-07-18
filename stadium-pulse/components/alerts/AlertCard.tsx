import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

type AlertProps = {
  id: string;
  zoneId: string;
  level: "warning" | "critical" | "info";
  summary: string;
  action: string;
  time: string;
  acknowledged?: boolean;
};

export function AlertCard({ id, level, zoneId, summary, action, time, acknowledged, onAcknowledge }: AlertProps & { onAcknowledge?: (id: string) => void }) {
  const isCritical = level === "critical";
  const isWarning = level === "warning";
  
  const bgClass = isCritical 
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50" 
    : isWarning
      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/50"
      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50";

  const iconColor = isCritical ? "text-red-600 dark:text-red-400" : isWarning ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400";

  return (
    <div className={`rounded-lg border p-4 ${bgClass} relative`} aria-live="polite">
      {acknowledged ? (
        <div className="absolute top-4 right-4 flex items-center text-green-600 dark:text-green-500 text-xs font-semibold">
          <CheckCircle2 size={14} className="mr-1" /> Ack
        </div>
      ) : (
        onAcknowledge && (
          <button 
            onClick={() => onAcknowledge(id)}
            className="absolute top-4 right-4 flex items-center bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400 border border-zinc-200 dark:border-zinc-700 hover:border-green-300 rounded text-xs font-semibold px-2 py-1 transition-colors"
          >
            Acknowledge
          </button>
        )
      )}
      <div className="flex gap-3">
        <div className="mt-1">
          {isCritical || isWarning ? (
            <AlertTriangle size={20} className={iconColor} />
          ) : (
            <Info size={20} className={iconColor} />
          )}
        </div>
        <div className="flex-1 space-y-2 pr-20">
          <div className="flex justify-between">
            <span className={`font-semibold ${iconColor}`}>Zone {zoneId}</span>
            <span className="text-xs text-zinc-500">{time}</span>
          </div>
          <p className="text-zinc-800 dark:text-zinc-200 font-medium">
            {summary}
          </p>
          <div className="bg-white/50 dark:bg-black/20 p-2 rounded text-sm text-zinc-800 dark:text-zinc-300">
            <strong>Action:</strong> {action}
          </div>
        </div>
      </div>
    </div>
  );
}
