import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const log = (msg: string) => console.log(`[${new Date().toISOString()}] ${msg}`);

// Seed data modeled on realistic India-hosted tournament stadium capacities
// All data aligns with the venue KB used by the fan navigation assistant (FR-1)

const prisma = new PrismaClient();

async function main() {
  log("🏟️  Seeding StadiumPulse AI venue data...\n");

  // ─── Venue ────────────────────────────────────────────────
  const venue = await prisma.venue.create({
    data: {
      name: "Maharashtra Cricket Stadium",
      tournamentId: "ICC-T20-2026",
      timezone: "Asia/Kolkata",
    },
  });
  log(`✅ Venue: ${venue.name}`);

  // ─── Zones ────────────────────────────────────────────────
  const zoneData = [
    {
      name: "Zone A – North Stand",
      capacity: 8000,
      currentCount: 5200,
      geoPolygon: { type: "polygon", coordinates: [[0, 0], [100, 0], [100, 50], [0, 50]] },
      sectionMetadata: { stand: "North", level: "Lower", gates: ["Gate 1", "Gate 2"] },
    },
    {
      name: "Zone B – South Stand",
      capacity: 8000,
      currentCount: 6100,
      geoPolygon: { type: "polygon", coordinates: [[0, 50], [100, 50], [100, 100], [0, 100]] },
      sectionMetadata: { stand: "South", level: "Lower", gates: ["Gate 4", "Gate 5"] },
    },
    {
      name: "Zone C – Concourse (Gate 2/3)",
      capacity: 5000,
      currentCount: 3800,
      geoPolygon: { type: "polygon", coordinates: [[100, 20], [150, 20], [150, 80], [100, 80]] },
      sectionMetadata: { area: "Concourse", level: "Ground", gates: ["Gate 2", "Gate 3"] },
    },
    {
      name: "Zone D – Premium Boxes",
      capacity: 1200,
      currentCount: 900,
      geoPolygon: { type: "polygon", coordinates: [[40, 100], [60, 100], [60, 120], [40, 120]] },
      sectionMetadata: { area: "Premium", level: "Upper", access: "VIP" },
    },
    {
      name: "Zone E – Overflow (Gate 7)",
      capacity: 3000,
      currentCount: 0,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: { type: "polygon", coordinates: [[-50, 20], [0, 20], [0, 80], [-50, 80]] },
      sectionMetadata: { area: "Overflow", level: "Ground", gates: ["Gate 7"], status: "closed_by_default" },
    },
  ];

  const zones: Record<string, string> = {};
  for (const zd of zoneData) {
    const zone = await prisma.zone.create({
      data: { venueId: venue.id, ...zd },
    });
    zones[zone.name] = zone.id;
    log(`  📍 Zone: ${zone.name} (${zone.capacity} cap)`);
  }

  // ─── Amenities ────────────────────────────────────────────
  const amenityData = [
    {
      zoneName: "Zone A – North Stand",
      type: "restroom" as const,
      name: "Restroom A1",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: true },
      status: "open" as const,
    },
    {
      zoneName: "Zone A – North Stand",
      type: "medical" as const,
      name: "Medical Centre 1",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: false },
      status: "open" as const,
    },
    {
      zoneName: "Zone A – North Stand",
      type: "food" as const,
      name: "Food Court North",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: false },
      status: "open" as const,
    },
    {
      zoneName: "Zone B – South Stand",
      type: "restroom" as const,
      name: "Restroom B1",
      accessibilityFlags: { wheelchair_accessible: false, braille_signage: false },
      status: "open" as const,
    },
    {
      zoneName: "Zone B – South Stand",
      type: "food" as const,
      name: "Food Court South",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: false },
      status: "open" as const,
    },
    {
      zoneName: "Zone B – South Stand",
      type: "exit" as const,
      name: "Emergency Exit B",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: true },
      status: "open" as const,
    },
    {
      zoneName: "Zone C – Concourse (Gate 2/3)",
      type: "restroom" as const,
      name: "Restroom C1 (Wheelchair Accessible)",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: true, baby_changing: true },
      status: "open" as const,
    },
    {
      zoneName: "Zone C – Concourse (Gate 2/3)",
      type: "lift" as const,
      name: "Lift 1 (Concourse to Premium)",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: true, audio_announcement: true },
      status: "open" as const,
    },
    {
      zoneName: "Zone C – Concourse (Gate 2/3)",
      type: "food" as const,
      name: "Gate 2 Food Court",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: false },
      status: "open" as const,
    },
    {
      zoneName: "Zone D – Premium Boxes",
      type: "restroom" as const,
      name: "Premium Restroom",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: true },
      status: "open" as const,
    },
    {
      zoneName: "Zone D – Premium Boxes",
      type: "food" as const,
      name: "Premium Lounge & Dining",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: false },
      status: "open" as const,
    },
    {
      zoneName: "Zone D – Premium Boxes",
      type: "seating" as const,
      name: "Premium Box Seating",
      accessibilityFlags: { wheelchair_accessible: true, braille_signage: false },
      status: "open" as const,
    },
  ];

  for (const ad of amenityData) {
    const { zoneName, ...rest } = ad;
    await prisma.amenity.create({
      data: { zoneId: zones[zoneName], ...rest },
    });
  }
  log(`  🏥 Amenities: ${amenityData.length} created`);

  // ─── Volunteers ───────────────────────────────────────────
  const volunteerData = [
    {
      name: "Arjun Patel",
      preferredLanguage: "en",
      zoneName: "Zone A – North Stand",
      contactChannel: "radio",
      role: "volunteer" as const,
    },
    {
      name: "Meena Sharma",
      preferredLanguage: "hi",
      zoneName: "Zone C – Concourse (Gate 2/3)",
      contactChannel: "radio",
      role: "volunteer" as const,
    },
    {
      name: "Ravi Kumar",
      preferredLanguage: "hi",
      zoneName: "Zone B – South Stand",
      contactChannel: "radio",
      role: "volunteer" as const,
    },
    {
      name: "Priya Deshmukh",
      preferredLanguage: "mr",
      zoneName: "Zone C – Concourse (Gate 2/3)",
      contactChannel: "radio",
      role: "volunteer" as const,
    },
    {
      name: "Vikram Singh",
      preferredLanguage: "en",
      zoneName: "Zone D – Premium Boxes",
      contactChannel: "radio",
      role: "volunteer" as const,
    },
    {
      name: "Control Room Admin",
      preferredLanguage: "en",
      zoneName: "Zone A – North Stand",
      contactChannel: "dashboard",
      role: "admin" as const,
      passwordHash: bcrypt.hashSync("admin123", 10),
    },
    {
      name: "Meera Operator",
      preferredLanguage: "en",
      zoneName: "Zone A – North Stand",
      contactChannel: "dashboard",
      role: "operator" as const,
    },
  ];

  for (const vd of volunteerData) {
    const { zoneName, ...rest } = vd;
    await prisma.volunteer.create({
      data: { zoneAssignmentId: zones[zoneName], ...rest },
    });
  }
  log(`  👤 Volunteers/Staff: ${volunteerData.length} created`);

  // ─── Transport Zones ──────────────────────────────────────
  await prisma.transportZone.createMany({
    data: [
      { name: "Lot A – Main Parking", type: "parking", capacity: 2000, currentCount: 1450 },
      { name: "Lot B – Overflow Parking", type: "parking", capacity: 1500, currentCount: 300 },
      { name: "Shuttle Stop A – Gate 1", type: "shuttle_stop", capacity: 200, currentCount: 45 },
      { name: "Shuttle Stop B – Gate 5", type: "shuttle_stop", capacity: 200, currentCount: 120 },
    ],
  });
  log("  🚌 Transport Zones: 4 created");

  // ─── Waste Bins ───────────────────────────────────────────
  const wasteBinData = [
    { zoneName: "Zone A – North Stand", fillPct: 0.45 },
    { zoneName: "Zone B – South Stand", fillPct: 0.72 },
    { zoneName: "Zone C – Concourse (Gate 2/3)", fillPct: 0.88 },
    { zoneName: "Zone D – Premium Boxes", fillPct: 0.20 },
    { zoneName: "Zone E – Overflow (Gate 7)", fillPct: 0.10 },
  ];

  for (const wb of wasteBinData) {
    await prisma.wasteBin.create({
      data: { zoneId: zones[wb.zoneName], fillPct: wb.fillPct },
    });
  }
  log(`  🗑️  Waste Bins: ${wasteBinData.length} created`);

  log("\n🎉 Seed complete! StadiumPulse AI venue KB is ready.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
