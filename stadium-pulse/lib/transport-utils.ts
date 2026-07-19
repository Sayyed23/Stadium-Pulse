export function getTransportStatusColor(pct: number) {
  if (pct >= 0.9)
    return {
      bar: "bg-red-500",
      badge: "text-red-400 bg-red-500/10",
      label: "Full",
    };
  if (pct >= 0.7)
    return {
      bar: "bg-amber-500",
      badge: "text-amber-400 bg-amber-500/10",
      label: "Filling",
    };
  return {
    bar: "bg-emerald-500",
    badge: "text-emerald-400 bg-emerald-500/10",
    label: "Available",
  };
}
