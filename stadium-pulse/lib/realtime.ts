/**
 * StadiumPulse AI — SSE / Event-Bus Helpers
 *
 * A single SSE endpoint (/api/zones/stream) serves both the ops dashboard
 * and the fan transport nudges. This module provides the shared utilities.
 */

// ─── Types ──────────────────────────────────────────────────

export interface ZoneUpdate {
  type: "zone_update";
  zone_id: string;
  zone_name: string;
  current_count: number;
  capacity: number;
  pct: number;
}

export interface AlertEvent {
  type: "alert";
  zone_id: string;
  zone_name: string;
  threshold_crossed: "warning" | "critical";
  generated_summary: string;
  recommended_action: string;
  alert_id: string;
  timestamp: string;
  acknowledged?: boolean;
}

export interface TransportUpdate {
  type: "transport_update";
  zone_id: string;
  name: string;
  transport_type: string;
  current_count: number;
  capacity: number;
  pct: number;
}

export interface WasteBinAlert {
  type: "waste_bin_alert";
  bin_id: string;
  zone_id: string;
  fill_pct: number;
}

export type SSEEvent = ZoneUpdate | AlertEvent | TransportUpdate | WasteBinAlert;

// ─── SSE Encoding ───────────────────────────────────────────

/**
 * Encode an event into SSE format.
 */
export function encodeSSE(event: SSEEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

/**
 * Create SSE response headers.
 */
export function sseHeaders(): HeadersInit {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}

// ─── Zone Simulation ────────────────────────────────────────

/**
 * Per-zone cooldown tracker.
 * Prevents alert spam from rapid threshold oscillation ("flapping").
 */
const cooldownMap = new Map<string, number>();

const COOLDOWN_MS = 60_000; // 60 seconds

/**
 * Check if a zone is within its alert cooldown window.
 */
export function isInCooldown(zoneId: string): boolean {
  const lastAlert = cooldownMap.get(zoneId);
  if (!lastAlert) return false;
  return Date.now() - lastAlert < COOLDOWN_MS;
}

/**
 * Mark a zone as having just triggered an alert.
 */
export function setCooldown(zoneId: string): void {
  cooldownMap.set(zoneId, Date.now());
}

/**
 * Simulate occupancy drift for a zone.
 * In production, this would be replaced by real IoT/CCTV data.
 */
export function simulateOccupancyChange(
  currentCount: number,
  capacity: number
): number {
  const pct = currentCount / capacity;

  // Bias toward increasing when below 80%, random walk when higher
  let delta: number;
  if (pct < 0.5) {
    delta = Math.floor(Math.random() * 80) + 20; // +20 to +100
  } else if (pct < 0.8) {
    delta = Math.floor(Math.random() * 60) - 10; // -10 to +50
  } else if (pct < 0.95) {
    delta = Math.floor(Math.random() * 40) - 15; // -15 to +25
  } else {
    delta = Math.floor(Math.random() * 30) - 20; // -20 to +10 (tends to decrease)
  }

  const newCount = Math.max(0, Math.min(capacity, currentCount + delta));
  return newCount;
}

// ─── Threshold Checking ─────────────────────────────────────

export interface ThresholdBreach {
  zoneId: string;
  zoneName: string;
  level: "warning" | "critical";
  currentCount: number;
  capacity: number;
  pct: number;
}

/**
 * Check if a zone's occupancy crosses the warning or critical threshold.
 * Returns null if no threshold was crossed or if the zone is in cooldown.
 */
export function checkThreshold(
  zoneId: string,
  zoneName: string,
  currentCount: number,
  capacity: number,
  warningThreshold: number,
  criticalThreshold: number
): ThresholdBreach | null {
  const pct = currentCount / capacity;

  if (pct >= criticalThreshold) {
    if (isInCooldown(zoneId)) return null;
    setCooldown(zoneId);
    return {
      zoneId,
      zoneName,
      level: "critical",
      currentCount,
      capacity,
      pct,
    };
  }

  if (pct >= warningThreshold) {
    if (isInCooldown(zoneId)) return null;
    setCooldown(zoneId);
    return {
      zoneId,
      zoneName,
      level: "warning",
      currentCount,
      capacity,
      pct,
    };
  }

  return null;
}
