import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function getTransportStatus(ratio: number): string {
  if (ratio > 0.9) return "full";
  if (ratio > 0.7) return "filling";
  return "available";
}

/**
 * GET /api/transport
 *
 * Returns current TransportZone and WasteBin state for FR-4.
 * Consumed by both (fan)/transport and (ops)/sustainability.
 */

export async function GET() {
  try {
    const [transportZones, wasteBins] = await Promise.all([
      prisma.transportZone.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.wasteBin.findMany({
        include: {
          zone: { select: { name: true } },
        },
        orderBy: { fillPct: "desc" },
      }),
    ]);

    return NextResponse.json({
      transport_zones: transportZones.map((tz) => ({
        id: tz.id,
        name: tz.name,
        type: tz.type,
        capacity: tz.capacity,
        current_count: tz.currentCount,
        pct: Math.round((tz.currentCount / tz.capacity) * 100) / 100,
        status: getTransportStatus(tz.currentCount / tz.capacity),
      })),
      waste_bins: wasteBins.map((wb) => ({
        id: wb.id,
        zone_id: wb.zoneId,
        zone_name: wb.zone.name,
        fill_pct: wb.fillPct,
        status: wb.fillPct > 0.85 ? "needs_collection" : "ok",
        last_updated: wb.lastUpdated.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Transport API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
