import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateStructuredOutput } from "@/lib/ai/client";
import { situationReportPrompt, situationReportUserPrompt } from "@/lib/ai/prompts";
import {
  encodeSSE,
  sseHeaders,
  simulateOccupancyChange,
  checkThreshold,
  type ZoneUpdate,
  type AlertEvent,
} from "@/lib/realtime";

/**
 * GET /api/zones/stream  (SSE)
 *
 * Single SSE endpoint consumed by BOTH:
 * - (ops)/dashboard → heatmap + situation feed
 * - (fan)/transport → shuttle/parking nudge cards
 *
 * Emits zone_update events every few seconds and alert events on threshold crossings.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isActive = true;

      // Track previous counts for trend calculation
      const previousCounts: Map<string, number[]> = new Map();

      const tick = async () => {
        if (!isActive) return;

        try {
          // Fetch all zones, transport zones, and waste bins
          const [zones, transportZones, wasteBins] = await Promise.all([
            prisma.zone.findMany(),
            prisma.transportZone.findMany(),
            prisma.wasteBin.findMany({ include: { zone: true } }),
          ]);

          // --- Process Standard Zones ---
          for (const zone of zones) {
            // Skip closed/overflow zones with 0 occupancy
            if (zone.currentCount === 0 && zone.name.includes("Overflow")) {
              continue;
            }

            // Simulate occupancy change
            const newCount = simulateOccupancyChange(
              zone.currentCount,
              zone.capacity
            );

            // Update DB
            await prisma.zone.update({
              where: { id: zone.id },
              data: { currentCount: newCount },
            });

            // Track trend
            const history = previousCounts.get(zone.id) || [];
            history.push(newCount);
            if (history.length > 5) history.shift();
            previousCounts.set(zone.id, history);

            // Emit zone_update
            const pct = newCount / zone.capacity;
            const update: ZoneUpdate = {
              type: "zone_update",
              zone_id: zone.id,
              zone_name: zone.name,
              current_count: newCount,
              capacity: zone.capacity,
              pct: Math.round(pct * 100) / 100,
            };

            controller.enqueue(encoder.encode(encodeSSE(update)));

            // Check threshold crossings
            const breach = checkThreshold(
              zone.id,
              zone.name,
              newCount,
              zone.capacity,
              zone.warningThreshold,
              zone.criticalThreshold
            );

            if (breach) {
              // Calculate trend
              const trendPctPerMin =
                history.length >= 2
                  ? ((history[history.length - 1] - history[0]) /
                      zone.capacity /
                      (history.length * 3)) * // 3 seconds per tick, convert to per-min
                      60 *
                      100
                  : 0;

              // Find nearby overflow options
              const overflowZones = zones
                .filter(
                  (z) =>
                    z.id !== zone.id &&
                    z.currentCount / z.capacity < 0.7
                )
                .map((z) => z.name)
                .slice(0, 3);

              // Generate LLM situation report
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

                // Persist to AlertLog
                const alertLog = await prisma.alertLog.create({
                  data: {
                    zoneId: zone.id,
                    thresholdCrossed: breach.level,
                    generatedSummary: report.summary,
                    recommendedAction: report.recommended_action,
                    triggeringMetric: pct,
                  },
                });

                // Emit alert event
                const alertEvent: AlertEvent = {
                  type: "alert",
                  zone_id: zone.id,
                  zone_name: zone.name,
                  threshold_crossed: breach.level,
                  generated_summary: report.summary,
                  recommended_action: report.recommended_action,
                  alert_id: alertLog.id,
                  timestamp: new Date().toISOString(),
                };

                controller.enqueue(encoder.encode(encodeSSE(alertEvent)));
              } catch (llmError) {
                console.error("LLM situation report failed:", llmError);

                // Fallback: emit alert without LLM report
                const fallbackAlert: AlertEvent = {
                  type: "alert",
                  zone_id: zone.id,
                  zone_name: zone.name,
                  threshold_crossed: breach.level,
                  generated_summary: `${zone.name} at ${Math.round(pct * 100)}% capacity.`,
                  recommended_action: "Monitor closely and prepare overflow routing.",
                  alert_id: "fallback",
                  timestamp: new Date().toISOString(),
                };

                controller.enqueue(encoder.encode(encodeSSE(fallbackAlert)));
              }
            }
          }

          // --- Process Transport Zones ---
          for (const tz of transportZones) {
            const newCount = simulateOccupancyChange(tz.currentCount, tz.capacity);
            await prisma.transportZone.update({
              where: { id: tz.id },
              data: { currentCount: newCount },
            });
            const pct = newCount / tz.capacity;
            controller.enqueue(encoder.encode(encodeSSE({
              type: "transport_update",
              zone_id: tz.id,
              name: tz.name,
              transport_type: tz.type,
              current_count: newCount,
              capacity: tz.capacity,
              pct: Math.round(pct * 100) / 100,
            })));
          }

          // --- Process Waste Bins ---
          for (const wb of wasteBins) {
            // Waste bins fill up slowly
            const drift = Math.random() * 0.05;
            let newFill = wb.fillPct + drift;
            if (newFill > 1) newFill = 0.05; // someone emptied it
            
            await prisma.wasteBin.update({
              where: { id: wb.id },
              data: { fillPct: newFill, lastUpdated: new Date() },
            });

            if (newFill > 0.85) {
              controller.enqueue(encoder.encode(encodeSSE({
                type: "waste_bin_alert",
                bin_id: wb.id,
                zone_id: wb.zoneId,
                fill_pct: Math.round(newFill * 100) / 100,
              })));
            }
          }
        } catch (error) {
          console.error("Zone stream tick error:", error);
        }

        // Schedule next tick (every 3 seconds)
        if (isActive) {
          setTimeout(tick, 3000);
        }
      };

      // Start the simulation loop
      tick();

      // Cleanup on close
      const cleanup = () => {
        isActive = false;
      };

      // Handle client disconnect
      request: {
        void cleanup;
      }
    },

    cancel() {
      // Client disconnected
      console.log("SSE client disconnected from /api/zones/stream");
    },
  });

  return new NextResponse(stream, { headers: sseHeaders() });
}
