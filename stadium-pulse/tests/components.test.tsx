/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias */
import { render, screen, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import DashboardPage from "../app/(ops)/ops/dashboard/page";
import React from "react";

// Mock EventSource globally
class MockEventSource {
  onmessage: ((ev: MessageEvent) => any) | null = null;
  onerror: (() => any) | null = null;
  listeners: Record<string, ((ev: any) => any)[]> = {};

  constructor(public url: string) {
    activeMockSource = this;
  }

  addEventListener(type: string, listener: (ev: any) => any) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  removeEventListener(type: string, listener: (ev: any) => any) {
    this.listeners[type] = (this.listeners[type] || []).filter(l => l !== listener);
  }

  close() {}

  // Helper to trigger events in tests
  trigger(type: string, data: any) {
    const event = { data: JSON.stringify(data) };
    if (type === "message" && this.onmessage) {
      this.onmessage(event as MessageEvent);
    }
    const handlers = this.listeners[type] || [];
    for (const h of handlers) {
      h(event);
    }
  }
}

let activeMockSource: MockEventSource | null = null;

vi.stubGlobal("EventSource", MockEventSource);

describe("Dashboard Page SSE Integration", () => {
  beforeEach(() => {
    activeMockSource = null;
    vi.clearAllMocks();
  });

  it("should render waiting state initially", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Waiting for zone data.../i)).toBeDefined();
  });

  it("should render zone cards and alert cards when SSE events are received", async () => {
    render(<DashboardPage />);
    
    expect(activeMockSource).not.toBeNull();

    // Trigger a zone update
    act(() => {
      activeMockSource!.trigger("message", {
        type: "zone_update",
        zone_id: "zone_1",
        zone_name: "North Stand",
        current_count: 500,
        capacity: 1000,
        pct: 0.5
      });
    });

    // Verify zone card is rendered
    expect(screen.getByText("North Stand")).toBeDefined();
    expect(screen.getByText("50%")).toBeDefined();
    expect(screen.getByText("500 / 1000")).toBeDefined();

    // Trigger an alert event
    act(() => {
      activeMockSource!.trigger("message", {
        type: "alert",
        alert_id: "alert_123",
        zone_name: "North Stand",
        threshold_crossed: "warning",
        generated_summary: "High crowd level in North Stand",
        recommended_action: "Open Gate 4",
        timestamp: new Date().toISOString()
      });
    });

    // Verify alert card is rendered
    expect(screen.getByText("High crowd level in North Stand")).toBeDefined();
    expect(screen.getByText(/Open Gate 4/i)).toBeDefined();
  });
});
