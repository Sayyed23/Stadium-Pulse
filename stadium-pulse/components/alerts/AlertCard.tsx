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
  
  const borderClass = isCritical 
    ? "bg-[#101415] border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]" 
    : isWarning
      ? "bg-[#101415] border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      : "bg-[#101415] border-[#00f2ff]/30 shadow-[0_0_15px_rgba(0,242,255,0.1)]";

  const iconColor = isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-[#00f2ff]";

  return (
    <div className={`rounded-2xl border p-4 ${borderClass} relative`} aria-live="polite">
      {acknowledged ? (
        <div className="absolute top-4 right-4 flex items-center text-[#5cf968] font-mono text-[10px] font-bold uppercase tracking-wider bg-[#5cf968]/10 border border-[#5cf968]/30 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={12} className="mr-1" /> ACKNOWLEDGED
        </div>
      ) : (
        onAcknowledge && (
          <button type="button" 
            onClick={() => onAcknowledge(id)}
            className="absolute top-4 right-4 flex items-center bg-[#1d2022] text-[#00f2ff] hover:bg-[#00f2ff] hover:text-[#00363a] border border-[#00f2ff]/40 rounded-lg text-xs font-mono font-bold px-2.5 py-1 transition-all"
          >
            Acknowledge
          </button>
        )
      )}
      <div className="flex gap-3">
        <div className="mt-0.5">
          {isCritical || isWarning ? (
            <AlertTriangle size={20} className={iconColor} />
          ) : (
            <Info size={20} className={iconColor} />
          )}
        </div>
        <div className="flex-1 space-y-2 pr-24">
          <div className="flex items-center justify-between">
            <span className={`font-bold text-xs uppercase font-mono ${iconColor}`}>Zone: {zoneId}</span>
            <span className="text-[10px] font-mono text-[#b9cacb]">{time}</span>
          </div>
          <p className="text-[#e0e3e5] text-xs leading-relaxed font-medium">
            {summary}
          </p>
          <div className="bg-[#1d2022] border border-[#3a494b]/40 p-2.5 rounded-xl text-xs text-[#00f2ff] font-mono">
            <strong className="text-[#b9cacb]">RECOMMENDED ACTION:</strong> {action}
          </div>
        </div>
      </div>
    </div>
  );
}
