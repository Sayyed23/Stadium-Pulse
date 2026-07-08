import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.chatLog.deleteMany({});
  await prisma.alertLog.deleteMany({});
  await prisma.incident.deleteMany({});
  await prisma.volunteer.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.wasteBin.deleteMany({});
  await prisma.zone.deleteMany({});
  await prisma.venue.deleteMany({});
  await prisma.transportZone.deleteMany({});

  console.log('Database cleared.');

  // Create Venue
  const venue = await prisma.venue.create({
    data: {
      id: 'stadium_pulse_venue',
      name: 'Stadium Pulse Arena',
      tournamentId: 'world_cup_2026',
      timezone: 'IST',
    },
  });
  console.log('Created Venue:', venue.name);

  // Create Zones
  const zonesData = [
    {
      id: 'zone_a',
      venueId: venue.id,
      name: 'Zone A (North Stand)',
      capacity: 8000,
      currentCount: 4500,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[0,0], [0,10], [10,10], [10,0]]),
      sectionMetadata: JSON.stringify({ entrance: 'Gate 1' }),
    },
    {
      id: 'zone_b',
      venueId: venue.id,
      name: 'Zone B (South Stand)',
      capacity: 8000,
      currentCount: 3000,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[10,10], [10,20], [20,20], [20,10]]),
      sectionMetadata: JSON.stringify({ entrance: 'Gate 4' }),
    },
    {
      id: 'zone_c',
      venueId: venue.id,
      name: 'Zone C (Concourse - Gate 2/3)',
      capacity: 5000,
      currentCount: 4600, // 92%, triggers warning alert in seed!
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[20,20], [20,30], [30,30], [30,20]]),
      sectionMetadata: JSON.stringify({ entrance: 'Gate 2' }),
    },
    {
      id: 'zone_d',
      venueId: venue.id,
      name: 'Zone D (Premium Boxes)',
      capacity: 1200,
      currentCount: 600,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[30,30], [30,40], [40,40], [40,30]]),
      sectionMetadata: JSON.stringify({ entrance: 'VIP Gate' }),
    },
    {
      id: 'zone_gate2',
      venueId: venue.id,
      name: 'Gate 2 Entrance',
      capacity: 2000,
      currentCount: 1200,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[0,0]]),
      sectionMetadata: JSON.stringify({}),
    },
    {
      id: 'zone_concourse_a',
      venueId: venue.id,
      name: 'Concourse A Waypoint',
      capacity: 3000,
      currentCount: 800,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[0,0]]),
      sectionMetadata: JSON.stringify({}),
    },
    {
      id: 'zone_restroom_3',
      venueId: venue.id,
      name: 'Restroom 3 Zone',
      capacity: 500,
      currentCount: 150,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[0,0]]),
      sectionMetadata: JSON.stringify({}),
    },
    {
      id: 'zone_gate7',
      venueId: venue.id,
      name: 'Gate 7 (Overflow)',
      capacity: 3000,
      currentCount: 0,
      warningThreshold: 0.85,
      criticalThreshold: 0.95,
      geoPolygon: JSON.stringify([[40,40], [40,50], [50,50], [50,40]]),
      sectionMetadata: JSON.stringify({ status: 'closed_by_default' }),
    },
  ];

  for (const z of zonesData) {
    await prisma.zone.create({ data: z });
  }
  console.log('Seeded Zones.');

  // Create Amenities
  const amenitiesData = [
    {
      id: 'amenity_restroom_3',
      zoneId: 'zone_c',
      type: 'restroom',
      name: 'Restroom-3',
      accessibilityFlags: JSON.stringify({ wheelchair_accessible: true, braille_signage: true }),
      status: 'open',
    },
    {
      id: 'amenity_medical_1',
      zoneId: 'zone_a',
      type: 'medical',
      name: 'Medical-1',
      accessibilityFlags: JSON.stringify({ wheelchair_accessible: true }),
      status: 'open',
    },
    {
      id: 'amenity_lift_1',
      zoneId: 'zone_c',
      type: 'lift',
      name: 'Lift-1',
      accessibilityFlags: JSON.stringify({ wheelchair_accessible: true }),
      status: 'open',
    },
    {
      id: 'amenity_restroom_gate2',
      zoneId: 'zone_gate2',
      type: 'restroom',
      name: 'Restroom at Gate 2',
      accessibilityFlags: JSON.stringify({ wheelchair_accessible: true }),
      status: 'open',
    }
  ];

  for (const a of amenitiesData) {
    await prisma.amenity.create({ data: a });
  }
  console.log('Seeded Amenities.');

  // Create Volunteers
  const volunteersData = [
    {
      id: 'vol_arjun',
      name: 'Arjun',
      preferredLanguage: 'en',
      zoneAssignment: 'zone_c',
      availability: 'available',
      contactChannel: 'SMS (+1 555-0199)',
    },
    {
      id: 'vol_meena',
      name: 'Meena',
      preferredLanguage: 'hi',
      zoneAssignment: 'zone_gate2',
      availability: 'available',
      contactChannel: 'WhatsApp (+1 555-0255)',
    },
    {
      id: 'vol_rahul',
      name: 'Rahul',
      preferredLanguage: 'en',
      zoneAssignment: 'zone_d',
      availability: 'available',
      contactChannel: 'Slack',
    }
  ];

  for (const v of volunteersData) {
    await prisma.volunteer.create({ data: v });
  }
  console.log('Seeded Volunteers.');

  // Create Transport Zones
  const transportData = [
    { id: 'transport_lot_b', name: 'Lot B', type: 'parking', capacity: 1000, currentCount: 850 }, // 85% capacity nudge!
    { id: 'transport_lot_d', name: 'Lot D', type: 'parking', capacity: 1500, currentCount: 300 },
    { id: 'transport_shuttle_1', name: 'Shuttle Stop 1', type: 'shuttle_stop', capacity: 500, currentCount: 200 }
  ];

  for (const t of transportData) {
    await prisma.transportZone.create({ data: t });
  }
  console.log('Seeded Transport Zones.');

  // Create Waste Bins
  const wasteBinsData = [
    { id: 'bin_c_1', zoneId: 'zone_c', fillPct: 0.40 },
    { id: 'bin_a_1', zoneId: 'zone_a', fillPct: 0.92 } // 92% triggers waste alert!
  ];

  for (const wb of wasteBinsData) {
    await prisma.wasteBin.create({ data: wb });
  }
  console.log('Seeded Waste Bins.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
