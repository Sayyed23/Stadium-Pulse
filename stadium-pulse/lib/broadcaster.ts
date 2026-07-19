import { EventEmitter } from "node:events";
import { prisma } from "./db";
import { generateStructuredOutput } from "./ai/client";
import { situationReportPrompt, situationReportUserPrompt } from "./ai/prompts";
import type { Zone, TransportZone, WasteBin } from "@prisma/client";
import {
  simulateOccupancyChange,
  checkThreshold,
  type SSEEvent,
  type ZoneUpdate,
  type AlertEvent,
} from "./realtime";


class EventBroadcaster extends EventEmitter {
  private intervalId: NodeJS.Timeout | null = null;
  private activeListeners = 0;
  private readonly previousCounts: Map<string, { counts: number[]; lastUpdated: number }> = new Map();
  private tickInFlight = false;
  private readonly HISTORY_MAX_AGE_MS = 60 * 1000; // 1 minute eviction

  constructor() {
    super();
    this.setMaxListeners(200); // Support high concurrent connections
  }

  public register(listener: (event: SSEEvent) => void) {
    this.activeListeners++;
    this.on("event", listener);

    // Start background tick on first connection
    if (this.activeListeners === 1) {
      this.startBroadcasting();
    }
  }

  public unregister(listener: (event: SSEEvent) => void) {
    this.activeListeners = Math.max(0, this.activeListeners - 1);
    this.off("event", listener);

    // Stop background tick when no one is listening
    if (this.activeListeners === 0) {
      this.stopBroadcasting();
    }
  }

  private startBroadcasting() {
    if (this.intervalId) return;

    const tick = async () => {
      try {
        // Fetch all zones, transport zones, and waste bins once for all clients
        const [zones, transportZones, wasteBins] = await Promise.all([
          prisma.zone.findMany(),
          prisma.transportZone.findMany(),
          prisma.wasteBin.findMany({ include: { zone: true } }),
        ]);

        const events: SSEEvent[] = [];
        const now = Date.now();

        this.evictOldHistory(now);
        await this.processStandardZones(zones, now, events);
        await this.processTransportZones(transportZones, events);
        await this.processWasteBins(wasteBins, events);

        // Emit events to all registered listeners (connections)
        for (const event of events) {
          this.emit("event", event);
        }
      } catch (error) {
        console.error("Broadcaster tick error:", error);
      }
    };

    const runTick = async () => {
      if (this.tickInFlight) return;
      this.tickInFlight = true;
      try {
        await tick();
      } finally {
        this.tickInFlight = false;
      }
    };

    void runTick();
    this.intervalId = setInterval(() => void runTick(), 3000);
  }

  private stopBroadcasting() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}

  private evictOldHistory(now: number) {
  for (const [zoneId, data] of this.previousCounts.entries()) {
    if (now - data.lastUpdated > this.HISTORY_MAX_AGE_MS) {
      this.previousCounts.delete(zoneId);
    }
  }
}

  private async processStandardZones(zones: Zone[], now: number, events: SSEEvent[]) {
  for (const zone of zones) {
    if (zone.currentCount === 0 && zone.name.includes("Overflow")) {
      continue;
    }

    const newCount = simulateOccupancyChange(zone.currentCount, zone.capacity);

    try {
      await prisma.zone.update({
        where: { id: zone.id },
        data: { currentCount: newCount },
      });
    } catch (err) {
      console.error(`Failed to update zone ${zone.id}:`, err);
      continue;
    }

    const historyData = this.previousCounts.get(zone.id) || { counts: [], lastUpdated: now };
    const history = historyData.counts;
    history.push(newCount);
    if (history.length > 5) history.shift();
    this.previousCounts.set(zone.id, { counts: history, lastUpdated: now });

    const pct = newCount / zone.capacity;
    const update: ZoneUpdate = {
      type: "zone_update",
      zone_id: zone.id,
      zone_name: zone.name,
      current_count: newCount,
      capacity: zone.capacity,
      pct: Math.round(pct * 100) / 100,
    };
    events.push(update);

    const breach = checkThreshold(
      zone.id,
      zone.name,
      newCount,
      zone.capacity,
      zone.warningThreshold,
      zone.criticalThreshold
    );

    if (breach) {
      await this.handleZoneBreach(zone, newCount, pct, history, zones, breach, events);
    }
  }
}

  private async handleZoneBreach(
    zone: Zone,
    newCount: number,
    pct: number,
    history: number[],
    zones: Zone[],
    breach: { level: "warning" | "critical" },
    events: SSEEvent[]
  ) {
  const trendPctPerMin =
    history.length >= 2
      ? (((history.at(-1) ?? 0) - (history.at(0) ?? 0)) /
        zone.capacity /
        15) * // 3s interval, 15s total for 5 elements
      60 *
      100
      : 0;

  const overflowZones = zones
    .filter((z) => z.id !== zone.id && z.currentCount / z.capacity < 0.7)
    .map((z) => z.name)
    .slice(0, 3);

  let summary = "";
  let recommendedAction = "";

  try {
    const { data: report } = await generateStructuredOutput<{
      summary: string;
      recommended_action: string;
      severity: string;
    }>(
      situationReportPrompt(),
      situationReportUserPrompt({
        zoneId: zone.id,
        zoneName: zone.name,
        capacity: zone.capacity,
        currentCount: newCount,
        occupancyPct: pct,
        trendPctPerMin,
        nearbyOverflowOptions: overflowZones,
      })
    );
    summary = report.summary;
    recommendedAction = report.recommended_action;
  } catch (err) {
    console.error("LLM report generation failed, using fallback:", err);
    summary = `${zone.name} is at ${Math.round(pct * 100)}% capacity.`;
    recommendedAction = "Monitor closely and prepare overflow routing.";
  }

  try {
    const alertLog = await prisma.alertLog.create({
      data: {
        zoneId: zone.id,
        thresholdCrossed: breach.level,
        generatedSummary: summary,
        recommendedAction: recommendedAction,
        triggeringMetric: pct,
      },
    });

    const alertEvent: AlertEvent = {
      type: "alert",
      zone_id: zone.id,
      zone_name: zone.name,
      threshold_crossed: breach.level,
      generated_summary: summary,
      recommended_action: recommendedAction,
      alert_id: alertLog.id,
      timestamp: new Date().toISOString(),
    };
    events.push(alertEvent);
  } catch (err) {
    console.error(`Failed to create alert log for zone ${zone.id}:`, err);
  }
}

  private async processTransportZones(transportZones: TransportZone[], events: SSEEvent[]) {
  for (const tz of transportZones) {
    const newCount = simulateOccupancyChange(tz.currentCount, tz.capacity);
    try {
      await prisma.transportZone.update({
        where: { id: tz.id },
        data: { currentCount: newCount },
      });
    } catch (err) {
      console.error(`Failed to update transport zone ${tz.id}:`, err);
      continue;
    }
    const pct = newCount / tz.capacity;
    events.push({
      type: "transport_update",
      zone_id: tz.id,
      name: tz.name,
      transport_type: tz.type,
      current_count: newCount,
      capacity: tz.capacity,
      pct: Math.round(pct * 100) / 100,
    });
  }
}

  private async processWasteBins(wasteBins: WasteBin[], events: SSEEvent[]) {
  for (const wb of wasteBins) {
    const driftArray = new Uint32Array(1);
    crypto.getRandomValues(driftArray);
    const drift = (driftArray[0] / 4294967295) * 0.05;
    let newFill = wb.fillPct + drift;
    if (newFill > 1) newFill = 0.05;

    try {
      await prisma.wasteBin.update({
        where: { id: wb.id },
        data: { fillPct: newFill, lastUpdated: new Date() },
      });
    } catch (err) {
      console.error(`Failed to update waste bin ${wb.id}:`, err);
      continue;
    }

    if (newFill > 0.85) {
      events.push({
        type: "waste_bin_alert",
        bin_id: wb.id,
        zone_id: wb.zoneId,
        fill_pct: Math.round(newFill * 100) / 100,
      });
    }
  }
}
}

// Global Broadcaster Singleton
const globalBroadcaster = new EventBroadcaster();
export { globalBroadcaster };
