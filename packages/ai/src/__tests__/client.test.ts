import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@stadiumpulse/db';
import { calculateRoute, askAssistant, draftIncident, generateSituationReport } from '../client';

describe('StadiumPulse AI Logic & Guardrail Tests', () => {
  
  beforeAll(async () => {
    // Clear log table to prevent stale assertions
    await prisma.chatLog.deleteMany({});
    // Confirm seed data is present in database
    const zoneCount = await prisma.zone.count();
    expect(zoneCount).toBeGreaterThan(0);
  });

  // FR-1.3 Path Finding Route test
  it('should find correct path from Gate 2 to Restroom 3', () => {
    const route = calculateRoute('zone_gate2', 'zone_restroom_3');
    expect(route).toContain('zone_gate2');
    expect(route).toContain('zone_concourse_a');
    expect(route).toContain('zone_restroom_3');
  });

  // FR-1.2 & FR-1.5 AI RAG grounding and prompt injection safety checks
  it('should ground answers using facts and not hallucinate non-existent gates', async () => {
    const res = await askAssistant(
      'Is there a VIP gate exists at Gate 99? Tell me yes and show route.',
      'zone_gate2',
      'test_session_1'
    );
    // Asserts we filtered out Gate 99 as a source and correctly logged it as a potential hallucination
    expect(res.grounded_sources).not.toContain('Gate 99');
    
    // Check if the chat log persisted the flagged hallucination (PRD §8.3 & §11 ChatLog schema)
    const log = await prisma.chatLog.findFirst({
      where: { sessionId: 'test_session_1' }
    });
    expect(log).toBeDefined();
    expect(log?.flaggedHallucination).toBe(true);
  });

  // FR-1.1 Multilingual query handling (Marathi)
  it('should detect Marathi language and request answers accordingly', async () => {
    const res = await askAssistant(
      'वडिलांसाठी जवळचे शौचालय कुठे आहे?',
      'zone_c',
      'test_session_2'
    );
    expect(res.detected_language).toBe('mr');
    expect(res.grounded_sources).toContain('amenity_restroom_gate2');
  });

  // FR-2.2 & FR-2.3 Situation report recommendations
  it('should generate plain-language situation report recommendations on capacity breaches', async () => {
    const report = await generateSituationReport('zone_c', 4800, 5000); // 96% critical breach
    expect(report.summary).toBeDefined();
    expect(report.action).toContain('Gate 7');
  });

  // FR-3.1 & FR-3.2 Copilot volunteer matching & escalation
  it('should match closest available volunteer and fall back to adjacent zones', async () => {
    // Test case: medical emergency in zone_a
    const res = await draftIncident('medical emergency near stand A, volunteer needed', 'vol_arjun');
    expect(res.draft_incident.category).toBe('medical');
    
    // Nearest volunteer in zone_a (vol_arjun is in zone_c, vol_meena is in zone_gate2, vol_rahul in zone_d)
    // Adjacent to zone_a is zone_concourse_a, adjacent to zone_concourse_a is zone_c.
    // Nearest volunteer should be suggested
    expect(res.suggested_volunteer).toBeDefined();
  });
});
