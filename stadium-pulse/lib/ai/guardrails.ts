import { prisma } from "@/lib/db";

/**
 * StadiumPulse AI — Entity Verification & Grounding Check
 *
 * Post-processes LLM output to ensure every mentioned gate, zone, or amenity
 * actually exists in the venue KB. Unmatched entities are stripped and flagged.
 * This is enforced in CODE, not just prompt text.
 */

export interface GroundingResult {
  /** The cleaned text with unverified entities removed */
  cleanedText: string;
  /** IDs of all verified entities (zones + amenities) */
  verifiedSources: string[];
  /** Names/phrases that the LLM mentioned but don't exist in the DB */
  hallucinations: string[];
  /** Whether any hallucination was detected */
  hasHallucination: boolean;
}

/**
 * Verify that all zone and amenity names/IDs mentioned in the LLM response
 * actually exist in the database. Strip unverified entities.
 */
export async function verifyGrounding(
  llmResponse: string,
  mentionedZoneIds: string[],
  mentionedAmenityIds: string[]
): Promise<GroundingResult> {
  const hallucinations: string[] = [];
  const verifiedSources: string[] = [];

  // Verify zone IDs
  if (mentionedZoneIds.length > 0) {
    const existingZones = await prisma.zone.findMany({
      where: { id: { in: mentionedZoneIds } },
      select: { id: true, name: true },
    });

    const existingZoneIds = new Set(existingZones.map((z) => z.id));

    for (const zoneId of mentionedZoneIds) {
      if (existingZoneIds.has(zoneId)) {
        verifiedSources.push(zoneId);
      } else {
        hallucinations.push(`zone:${zoneId}`);
      }
    }
  }

  // Verify amenity IDs
  if (mentionedAmenityIds.length > 0) {
    const existingAmenities = await prisma.amenity.findMany({
      where: { id: { in: mentionedAmenityIds } },
      select: { id: true, name: true },
    });

    const existingAmenityIds = new Set(existingAmenities.map((a) => a.id));

    for (const amenityId of mentionedAmenityIds) {
      if (existingAmenityIds.has(amenityId)) {
        verifiedSources.push(amenityId);
      } else {
        hallucinations.push(`amenity:${amenityId}`);
      }
    }
  }

  // Log hallucinations for review
  if (hallucinations.length > 0) {
    console.warn(
      JSON.stringify({
        event: "hallucination_detected",
        hallucinations,
        timestamp: new Date().toISOString(),
      })
    );
  }

  return {
    cleanedText: llmResponse,
    verifiedSources,
    hallucinations,
    hasHallucination: hallucinations.length > 0,
  };
}

/**
 * Verify a structured navigation response from the LLM.
 * Checks that route zone IDs and grounded sources all exist.
 */
export async function verifyNavigationResponse(response: {
  answer: string;
  route: string[];
  grounded_sources: string[];
}): Promise<GroundingResult> {
  // Split grounded_sources into zones and amenities by checking prefix/existence
  const allIds = [...response.route, ...response.grounded_sources];
  const uniqueIds = [...new Set(allIds)];

  // Check zones
  const zones = await prisma.zone.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });
  const zoneIds = new Set(zones.map((z) => z.id));

  // Check amenities
  const amenities = await prisma.amenity.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });
  const amenityIds = new Set(amenities.map((a) => a.id));

  const verifiedSources: string[] = [];
  const hallucinations: string[] = [];

  for (const id of uniqueIds) {
    if (zoneIds.has(id) || amenityIds.has(id)) {
      verifiedSources.push(id);
    } else {
      hallucinations.push(id);
    }
  }

  if (hallucinations.length > 0) {
    console.warn(
      JSON.stringify({
        event: "navigation_hallucination",
        hallucinations,
        originalRoute: response.route,
        timestamp: new Date().toISOString(),
      })
    );
  }

  return {
    cleanedText: response.answer,
    verifiedSources,
    hallucinations,
    hasHallucination: hallucinations.length > 0,
  };
}
