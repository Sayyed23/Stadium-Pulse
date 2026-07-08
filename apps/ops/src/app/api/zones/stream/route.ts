import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@stadiumpulse/db';
import { generateSituationReport } from '@stadiumpulse/ai';

export const dynamic = 'force-dynamic';

// In-memory cooldown tracker to prevent flapping alert spam (FR-2.2 mitigation)
const cooldowns: Record<string, number> = {};
const COOLDOWN_MS = 60000; // 60 seconds

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  // Create stream
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial zone configuration state
      try {
        const initialZones = await prisma.zone.findMany({});
        initialZones.forEach(z => {
          sendEvent('zone_update', {
            zone_id: z.id,
            current_count: z.currentCount,
            capacity: z.capacity,
            pct: z.currentCount / z.capacity
          });
        });
      } catch (e) {
        console.error("Error fetching initial zones:", e);
      }

      // Interval loop simulating ticks (FR-2.1 sensor simulator)
      const interval = setInterval(async () => {
        try {
          const zones = await prisma.zone.findMany({});

          for (const zone of zones) {
            // Simulate random crowd fluctuation (-50 to +150 people)
            let delta = Math.floor(Math.random() * 200) - 50;
            // Prevent going below 0 or above capacity * 1.05
            let nextCount = Math.max(0, Math.min(Math.floor(zone.capacity * 1.02), zone.currentCount + delta));

            // Update database count in-memory
            await prisma.zone.update({
              where: { id: zone.id },
              data: { currentCount: nextCount }
            });

            const pct = nextCount / zone.capacity;

            // Send standard zone update event for live heatmap (FR-2.1)
            sendEvent('zone_update', {
              zone_id: zone.id,
              current_count: nextCount,
              capacity: zone.capacity,
              pct: pct
            });

            // Threshold watching logic (FR-2.2 warning/critical)
            let thresholdCrossed: 'warning' | 'critical' | null = null;
            if (pct >= zone.criticalThreshold) {
              thresholdCrossed = 'critical';
            } else if (pct >= zone.warningThreshold) {
              thresholdCrossed = 'warning';
            }

            if (thresholdCrossed) {
              const now = Date.now();
              const lastAlertTime = cooldowns[zone.id] || 0;

              // Check if outside cooldown window (FR-2.2 Cooldown gate)
              if (now - lastAlertTime > COOLDOWN_MS) {
                cooldowns[zone.id] = now;

                // Invoke LLM situation report generator
                const report = await generateSituationReport(zone.id, nextCount, zone.capacity);

                // Persist alert in database (FR-2.4 Alert log tracking)
                const newAlert = await prisma.alertLog.create({
                  data: {
                    zoneId: zone.id,
                    thresholdCrossed,
                    generatedSummary: report.summary,
                    recommendedAction: report.action
                  }
                });

                // Push alert notification down SSE channel
                sendEvent('alert', {
                  id: newAlert.id,
                  zone_id: zone.id,
                  threshold_crossed: thresholdCrossed,
                  generated_summary: report.summary,
                  recommended_action: report.action,
                  timestamp: newAlert.timestamp
                });

                // FR-4.1 Sustainability/Transport nudge reuse logic
                // If capacity is high, trigger parking redirection alerts
                if (zone.id === 'zone_c' && thresholdCrossed === 'critical') {
                  sendEvent('sustainability_nudge', {
                    type: 'parking_redirect',
                    message: "Lot B at 85% capacity, redirecting incoming traffic to Lot D.",
                    timestamp: new Date()
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error("Error in SSE loop:", e);
        }
      }, 4000); // Trigger stream updates every 4 seconds

      // Cleanup on client close
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}
