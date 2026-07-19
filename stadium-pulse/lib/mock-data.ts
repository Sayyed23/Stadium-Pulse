export interface MockCrowdZone {
  id: string;
  name: string;
  pct: number;
  count: number;
  capacity: number;
  trend: "up" | "down" | "stable";
}

export const MOCK_CROWD_ZONES: MockCrowdZone[] = [
  {
    id: "zone_a",
    name: "Zone A — North Stand",
    pct: 72,
    count: 5760,
    capacity: 8000,
    trend: "up",
  },
  {
    id: "zone_b",
    name: "Zone B — South Stand",
    pct: 91,
    count: 7280,
    capacity: 8000,
    trend: "up",
  },
  {
    id: "zone_c",
    name: "Zone C — East Wing",
    pct: 58,
    count: 2900,
    capacity: 5000,
    trend: "stable",
  },
  {
    id: "zone_d",
    name: "Zone D — West Wing",
    pct: 45,
    count: 2250,
    capacity: 5000,
    trend: "down",
  },
  {
    id: "zone_e",
    name: "Concourse Level 1",
    pct: 83,
    count: 4150,
    capacity: 5000,
    trend: "up",
  },
  {
    id: "zone_f",
    name: "Concourse Level 2",
    pct: 35,
    count: 1050,
    capacity: 3000,
    trend: "down",
  },
];

export interface MockVolunteerTask {
  id: string;
  title: string;
  zone: string;
  priority: "low" | "medium" | "high";
  due: string;
  status: "pending" | "in-progress" | "completed";
}

export const MOCK_VOLUNTEER_TASKS: MockVolunteerTask[] = [
  {
    id: "T-001",
    title: "Patrol Zone B concourse",
    zone: "Zone B",
    priority: "medium",
    due: "16:30",
    status: "in-progress",
  },
  {
    id: "T-002",
    title: "Assist wheelchair guest — Gate 3",
    zone: "Zone A",
    priority: "high",
    due: "16:15",
    status: "pending",
  },
  {
    id: "T-003",
    title: "Restock water station 2",
    zone: "Zone C",
    priority: "low",
    due: "17:00",
    status: "pending",
  },
];
