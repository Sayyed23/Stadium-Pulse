# 🏟️ StadiumPulse AI — Enterprise Stadium Operations & Tournament Companion

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-stadium--pulse--sooty.vercel.app-00f2ff?style=for-the-badge&logo=vercel&logoColor=white)](https://stadium-pulse-sooty.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Sayyed23%2FStadium--Pulse-181717?style=for-the-badge&logo=github)](https://github.com/Sayyed23/Stadium-Pulse)

> 🔗 **Live Web Application**: [https://stadium-pulse-sooty.vercel.app](https://stadium-pulse-sooty.vercel.app)  
> 🏗️ **Technical Architecture Specification**: [ARCHITECTURE.md](file:///d:/Stadium%20Pulse/ARCHITECTURE.md)

**StadiumPulse AI** is a state-of-the-art, GenAI-enabled operations layer, spectator navigation companion, and control room management platform custom-built for large-scale sports arenas and multi-stage tournaments. Consolidating spectator navigation, volunteer dispatch workflows, real-time telemetry analytics, and staff command center control systems into a single Next.js application, the platform uses real-time event streaming, premium Stitch UI layouts, and advanced Google Gemini LLM orchestration to translate complex stadium data feeds into grounded, actionable, and secure insights.

---

## 🎯 Executive Summary & Problem Statement

Sports tournaments and mega-events at high-capacity stadiums present monumental operational challenges. Spectators struggle with complex layouts, changing wait times, transit updates, and accessibility barriers. Meanwhile, stadium organizers and ground staff navigate disconnected tools for volunteer dispatch, security incident reporting, crowd flow management, and facilities maintenance.

StadiumPulse AI aligns these operational workflows into a single system, bridging the gap between spectators, volunteers, operators, and administrators:

```
                  ┌──────────────────────────────────────────────┐
                  │              STADIUM TELEMETRY               │
                  │ (Occupancy, Shuttles, Bins, Emergency GPS)   │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              STADIUMPULSE CORE               │
                  │  (Real-Time SSE Bus, Google Gemini Engine)   │
                  └──────┬──────────────────────┬─────────┬──────┘
                         │                      │         │
        ┌────────────────┴──────────────┐       │         └────────────────┐
        ▼                               ▼       ▼                          ▼
┌──────────────┐                ┌──────────────┐ ┌──────────────┐   ┌──────────────┐
│  SPECTATORS  │                │  VOLUNTEERS  │ │  OPERATORS   │   │  ADMINS      │
│  Navigation, │                │ Incident     │ │ Live alerts, │   │ Config,      │
│  Chat RAG,   │                │ Reporting,   │ │ Crowd Flow,  │   │ Guardrails,  │
│  SOS System  │                │ Tasks Feed   │ │ Control Room │   │ Audit Logs   │
└──────────────┘                └──────────────┘ └──────────────┘   └──────────────┘
```

---

## 🧭 Challenge Alignment Matrix

### **Challenge**: Hack2Skill — GenAI-Enabled Stadium Operations & Tournament Experience
**Team**: Chicha Core | **Project Owner**: Ismail Sayyed

| Challenge Target Requirement | StadiumPulse AI Feature Suite | Technical Implementation & Grounding Guardrails |
| :--- | :--- | :--- |
| **1. Multilingual Fan Navigation & RAG** | Interactive Map (`/fan/map`), Indoor Wayfinding (`/fan/navigation`), and AI Chat Assistant (`/fan/assistant`). | Database-backed grounding logic (`lib/ai/guardrails.ts`) filters out hallucinated locations, verifying IDs against DB. |
| **2. Real-Time Crowd Telemetry & Alerts** | Server-Sent Events (SSE) stream (`/api/zones/stream`) driving live concourse occupancy heatmaps. | Singleton `EventBroadcaster` prevents database connection pool exhaustion; 60s cooldown prevents flapping. |
| **3. AI Volunteer & Incident Intake** | Two-panel incident workspace (`/volunteer/copilot`) generating structured tickets from raw voice/text. | Real-time matchmaking based on GPS proximity, role assignment, and language compatibility. |
| **4. Geolocation SOS & Emergency Protocols** | 1-Tap Geolocation SOS dispatch (`/fan/emergency`) and wheelchair-accessible route guides. | Instant latitude/longitude transmission to the control room, generating high-priority alerts with sound cues. |
| **5. Transit & Sustainability Telemetry** | Real-time shuttle countdowns, parking occupancy meters, and smart waste fill alerts (`/ops/sustainability`). | SSE event bus broadcasting shuttle departure logs and bin overflow alerts (>85% fill) for ground clearance. |
| **6. Administrative Governance & Audit** | Admin governance control center (`/admin`) for venue polygons, prompts, and system telemetry tracking. | Prisma ORM AuditLog entity logging threshold breaches, staff responses, and LLM token usage metrics. |

---

## 🎨 Design System, Color Tokens & Aesthetics

StadiumPulse AI implements a premium, high-fidelity dark obsidian and telemetry-cyan design system inspired by professional control-room interfaces. The interface is optimized to minimize eye strain in dark environments while highlighting critical live events.

### Design Principles
1. **Glassmorphism Containers**: High-end surface card designs using semi-transparent dark obsidian layers (`rgba(29, 32, 34, 0.85)`) paired with thin border strokes and micro-shadows to represent depth.
2. **Neon Alert Indicators**: Electric Cyan (`#00f2ff`) denotes active system telemetry, Neon Green (`#5cf968`) shows available facilities, Amber Gold (`#fbbf24`) warns of moderate congestion, and Crimson Red (`#ef4444`) commands attention for emergencies and overflows.
3. **Typography Scaling**: Configured using `Montserrat` for bold tracking headers, `Geist Sans` for UI labeling, `Inter` for content paragraphs, and `Roboto Mono` for system telemetry metrics.
4. **Adaptive Device Layout**:
   - **Desktop View**: Expanding multi-pane views (`max-w-7xl mx-auto`), side-by-side split panels, and persistent navigation menus.
   - **Mobile View**: Floating bottom navigation bar, quick swipeable cards, touch-friendly filter tags, and large buttons for high-stress operational use.

### CSS Color Token Values
```css
:root {
  --bg-obsidian: #101415;
  --bg-obsidian-glass: rgba(16, 20, 21, 0.85);
  --surface-container: #1d2022;
  --surface-elevated: #272a2c;
  --border-color: rgba(58, 73, 75, 0.4);
  
  --neon-cyan: #00f2ff;
  --neon-cyan-glow: rgba(0, 242, 255, 0.35);
  --neon-green: #5cf968;
  --neon-green-glow: rgba(92, 249, 104, 0.3);
  
  --warning-amber: #fbbf24;
  --error-crimson: #ef4444;
  --text-primary: #e0e3e5;
  --text-muted: #b9cacb;
}
```

---

## 📂 Complete Codebase File Directory Structure

A detailed overview of the repository hierarchy, modular distribution, and component layout:

```
stadium-pulse/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline for linting, type-checking, and tests
├── app/
│   ├── (public)/                # Public portal layouts and static pages
│   │   ├── page.tsx             # Interactive landing page and portal selector
│   │   └── layout.tsx           # Public shell with responsive design boundaries
│   ├── (fan)/                   # Fan Experience Portal
│   │   ├── fan/
│   │   │   ├── page.tsx         # Spectator landing with live quick telemetry stats
│   │   │   ├── assistant/       # Multilingual Fan RAG Navigation interface
│   │   │   ├── map/             # Interactive map with facility filters and route overlays
│   │   │   ├── navigation/      # Turn-by-turn waypoint route directory
│   │   │   ├── amenities/       # Interactive amenities feed and wait-time indicators
│   │   │   ├── crowd/           # Heatmap and zone congestion analytics
│   │   │   ├── transport/       # Live shuttle countdown meters & parking lots
│   │   │   ├── accessibility/   # 1-Tap accessibility help requests & elevator stats
│   │   │   ├── emergency/       # SOS Emergency center with live GPS broadcast
│   │   │   └── settings/        # System contrast, language, and PWA configuration
│   │   └── layout.tsx           # Fan navigation shell with mobile bottom docks
│   ├── (volunteer)/             # Volunteer Portal
│   │   ├── volunteer/
│   │   │   ├── page.tsx         # Duty Operations Dashboard & active task feeds
│   │   │   ├── copilot/         # Two-panel voice/text Incident Intake Copilot
│   │   │   ├── tasks/           # Assigned task checklist and verification logs
│   │   │   ├── incidents/       # Incident logging records
│   │   │   └── profile/         # Volunteer preference, shift status, and language settings
│   │   └── layout.tsx           # Volunteer navigation shell and status tracking
│   ├── (ops)/                   # Operations Control Portal
│   │   ├── ops/
│   │   │   ├── dashboard/       # Control room master console with active incident metrics
│   │   │   ├── alerts/          # Alert log acknowledgement center
│   │   │   ├── sustainability/  # Smart waste bin fill-levels & recycling statistics
│   │   │   └── login/           # Dedicated staff authentication
│   │   └── layout.tsx           # Operations sidebars and alert indicator audio cues
│   ├── (admin)/                 # Administrative Portal
│   │   ├── admin/
│   │   │   ├── page.tsx         # Governance center with multi-venue configuration stats
│   │   │   ├── venues/          # Seating capacity, schedule, and zone polygon editor
│   │   │   ├── prompts/         # LLM Prompt tuner & grounding config manager
│   │   │   ├── audit/           # Audit logs & hallucination incident history
│   │   │   └── users/           # Staff accounts & permissions directory
│   │   └── layout.tsx           # Admin shells and analytics sidebars
│   ├── (auth)/                  # Shared Authentication
│   │   ├── login/               # Unified role-based login portal with demo presets
│   │   ├── verify/              # OTP Verification interface
│   │   └── forgot-password/     # Credentials recovery page
│   └── api/                     # Type-safe Next.js API Routes
│       ├── alerts/
│       │   └── [id]/
│       │       └── ack/         # POST: Staff incident alert acknowledgement
│       ├── assistant/           # POST: Multilingual Fan RAG query handler
│       ├── auth/
│       │   ├── login/           # POST: Staff credentials validation & signed token setup
│       │   └── logout/          # POST: Session token cleanup and redirection
│       ├── copilot/             # POST: Volunteer unstructured voice/text ingestion
│       ├── incidents/           # GET: Retrieve active / POST: Create new incidents
│       │   └── [id]/            # PATCH: Update incident state and assign volunteers
│       ├── transport/           # GET: Fetch static transport and waste metrics
│       └── zones/
│           └── stream/          # GET: Server-Sent Events (SSE) telemetry bus connection
├── components/                  # Shared React 19 UI component repository
│   ├── admin/
│   │   └── TableRowActions.tsx  # Shared edit/delete actions for admin directory tables
│   ├── alerts/
│   │   └── AlertCard.tsx        # High-priority alert banner with flashing visual states
│   ├── chat/
│   │   └── ChatWindow.tsx       # Embedded RAG chat assistant for fans and copilots
│   ├── layout/
│   │   ├── AdminShell.tsx       # Sidebar navigation layout for admins
│   │   ├── FanShell.tsx         # Mobile-first navigation layout for spectators
│   │   ├── SidebarHeader.tsx    # Standardized header with telemetry status controls
│   │   └── VolunteerShell.tsx   # Sidebar layout for active-duty volunteer operators
│   └── notifications/
│       └── NotificationCard.tsx # Localized volunteer dispatch updates card component
├── hooks/
│   └── useZoneStream.ts         # Hook subscribing components to active Server-Sent Events
├── lib/                         # Core utility & infrastructure libraries
│   ├── ai/
│   │   ├── client.ts            # Google Gemini SDK API instances and formatting wrappers
│   │   ├── guardrails.ts        # RAG grounding validation and hallucination filters
│   │   └── prompts.ts           # Prompt templates for copilots and situation reports
│   ├── auth.ts                  # Web Crypto signed token manager & cookie helpers
│   ├── broadcaster.ts           # Singleton EventBroadcaster SSE connection pool
│   ├── db.ts                    # Prisma Client database connector singleton
│   ├── mock-data.ts             # Static mock assets for fallback rendering
│   ├── rate-limit.ts            # Serverless sliding-window Redis rate limiter & memory fallback
│   ├── realtime.ts              # Telemetry simulator generator and event encoders
│   ├── transport-utils.ts       # Color mapping helper rules for transit status badges
│   └── validators.ts            # Zod validation schema rules
├── prisma/
│   ├── schema.prisma            # Seating capacity, schedule, and zone database models
│   └── seed.ts                  # Database seeding script for venues, zones, and volunteers
├── public/
│   ├── manifest.json            # Progressive Web App manifest configurations
│   ├── icons/                   # PWA touch icons
│   └── sounds/                  # Warning and emergency audio alarms for Control Room
├── tests/                       # Vitest automated test suite directory
│   ├── ai-client.test.ts        # Asserts LLM client structured formats
│   ├── api-assistant.test.ts    # Asserts assistant API route responses and fallbacks
│   ├── api-copilot.test.ts      # Asserts incident intake parser functions
│   ├── api-incidents.test.ts    # Asserts incidents endpoint CRUD workflows
│   ├── api-zones-stream.test.ts # Asserts SSE response channels
│   ├── auth.test.ts             # Asserts HMAC session validation logic
│   ├── components.test.tsx      # Asserts React rendering logic for telemetry feeds
│   ├── guardrails.test.ts       # Asserts database-backed grounding validators
│   ├── rate-limit.test.ts       # Asserts Sliding-Window limits and local fallbacks
│   └── threshold.test.ts        # Asserts warning/critical occupancy computations
├── tsconfig.json                # TypeScript configuration options
└── vitest.config.ts             # Test runner configs
```

---

## ⚡ Real-Time Telemetry & Event Stream Architecture

To support high-concurrency connections without exhausting database connection pools, StadiumPulse AI uses a **Global Event Broadcaster Singleton** (`lib/broadcaster.ts`):

```
                        ┌──────────────────────────────┐
                        │      Postgres Database       │
                        └──────────────┬───────────────┘
                                       │
                                       ▼ 3s Central Loop
                        ┌──────────────────────────────┐
                        │    EventBroadcaster Tick     │
                        └──────────────┬───────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
             [ Zone Updates ]   [ Alert Events ]   [ Transport/Waste ]
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                                       ▼ SSE Broadcast
                        ┌──────────────────────────────┐
                        │  Unified SSE Client Stream   │
                        │     (/api/zones/stream)      │
                        └──────┬────────────────┬──────┘
                               │                │
                               ▼ Client A       ▼ Client B
```

### Event Broadcaster Mechanics
1. **Background Broadcaster Loop**: Rather than querying the database repeatedly for each connected user, a single centralized `setInterval` loop in `EventBroadcaster` runs every 3 seconds to fetch the latest occupancy counts, waste bin fill-levels, and transit capacities.
2. **Active Listener Management**: When a client requests `/api/zones/stream`, the SSE route registers an event listener callback on the singleton `EventBroadcaster` instance. When the first client connects, the broadcaster starts its background loop. When all clients disconnect, the loop automatically spins down to conserve system resources.
3. **Simulated Telemetry Drift**: To represent a live, active stadium during the tournament, the system applies controlled random walks to zone occupancies, parking capacities, and waste bin fill levels.

### SSE Event Interface Definitions
The SSE stream dispatches events serialized in JSON format using a consistent schema:

```typescript
export type SSEEvent = ZoneUpdate | AlertEvent | TransportUpdate | WasteBinAlert;

export interface ZoneUpdate {
  type: "zone_update";
  zone_id: string;
  zone_name: string;
  current_count: number;
  capacity: number;
  pct: number;
}

export interface AlertEvent {
  type: "alert";
  zone_id: string;
  zone_name: string;
  threshold_crossed: "warning" | "critical";
  generated_summary: string;
  recommended_action: string;
  alert_id: string;
  timestamp: string;
}

export interface TransportUpdate {
  type: "transport_update";
  zone_id: string;
  name: string;
  transport_type: string;
  current_count: number;
  capacity: number;
  pct: number;
}

export interface WasteBinAlert {
  type: "waste_bin_alert";
  bin_id: string;
  zone_id: string;
  fill_pct: number;
}
```

---

## 🧠 Google Gemini GenAI Grounding & Guardrail Logic

To prevent Google Gemini from hallucinating non-existent gates, zones, elevators, or food stands, StadiumPulse AI uses a **database-backed verification layer** (`lib/ai/guardrails.ts`).

```
                              ┌──────────────────┐
                              │    User Query    │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  Fetch Context   │
                              │  (From Postgres) │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  Gemini LLM Call │
                              │ (Inject Context) │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  Parse Response  │
                              │  (Get Entity IDs)│
                              └────────┬─────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │   Database Guardrail Check   │
                        │ (Verify IDs exist in DB)     │
                        └──────────────┬───────────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      ▼ Valid                           ▼ Hallucination
             ┌──────────────────┐              ┌──────────────────┐
             │ Return Response, │              │ Strip Entity,    │
             │ Log Verification │              │ Flag Audit Log   │
             └──────────────────┘              └──────────────────┘
```

### Grounding Implementation details
1. **Context Injection (RAG)**: The user's query is analyzed, and the closest physical zones, transport details, and amenities are fetched from the PostgreSQL database. These verified records are injected into the Gemini LLM prompt context as the absolute source of truth.
2. **Entity ID Identification**: The LLM is instructed to output a structured JSON object containing its text answer, alongside lists of `zone` and `amenity` database IDs that were referenced in the text.
3. **Database Validation Pass**: The verification algorithm checks each returned entity ID against the database records.
4. **Hallucination Containment**: If a returned ID does not exist in the database (indicating a hallucination), the system flags the interaction, strips the unverified references from the response, and logs a hallucination event for admin review.

### Verifier Source Code Reference (`lib/ai/guardrails.ts`)
```typescript
import { prisma } from "../db";

export interface GroundingVerificationResult {
  verified: boolean;
  hallucinations: string[];
}

export async function verifyGrounding(
  routes: string[],
  groundedSources: string[]
): Promise<GroundingVerificationResult> {
  const hallucinations: string[] = [];

  // 1. Verify Zone IDs
  for (const zoneId of routes) {
    const exists = await prisma.zone.findUnique({ where: { id: zoneId } });
    if (!exists) {
      hallucinations.push(`zone:${zoneId}`);
    }
  }

  // 2. Verify Amenity/Source IDs
  for (const sourceId of groundedSources) {
    const exists = await prisma.amenity.findUnique({ where: { id: sourceId } });
    if (!exists) {
      hallucinations.push(`amenity:${sourceId}`);
    }
  }

  return {
    verified: hallucinations.length === 0,
    hallucinations,
  };
}
```

---

## 🔒 Security & Session Governance Architecture

StadiumPulse AI is designed to protect critical operations from unauthorized access, rate spikes, and credential attacks.

### 1. Web Crypto HMAC SHA-256 Authentication
The platform avoids heavy session engines in favor of Web Crypto API HMAC SHA-256 signed session tokens, stored in `httpOnly` secure cookies:
- **Encoding Session**: Formats the volunteer/staff ID, name, role, and expiration timestamp (`exp`). It signs this payload using a shared `SESSION_SECRET` key via HMAC SHA-256.
- **Decoding & Verification**: Validates the signature, parses the claims, and verifies that the session is not expired.
- **Active DB Revalidation**: During route middleware checks, the system matches the session details against active database volunteer records to instantly revoke access if a staff member is suspended or their role changes.

### 2. Dual-Tier Token-Bucket Rate Limiting
To prevent denial-of-service attempts and high API fees, all public LLM endpoints (`/api/assistant` and `/api/copilot`) use a sliding-window rate limiter:
- **Tier 1 (Redis)**: Upstash Redis keeps track of requests in serverless environments, limiting fan RAG queries to 20 per minute and staff copilot requests to 30 per minute.
- **Tier 2 (Process Memory Fallback)**: If Redis connection values are missing, the system falls back to an in-memory Map rate-limiter, ensuring rate limits are maintained even in local sandbox environments.

### 3. Production security headers
The configuration in `next.config.ts` applies strict HTTP headers to prevent security vulnerabilities:
- **`Strict-Transport-Security`**: Force HTTPS connections.
- **`X-Frame-Options: DENY`**: Prevent Clickjacking attacks.
- **`X-Content-Type-Options: nosniff`**: Block MIME-sniffing exploits.
- **`Content-Security-Policy (CSP)`**: Strict Content Security Policies control where resources can be fetched from, allowing only trusted Google Maps, fonts, and internal scripts to execute.

---

## 💾 Database Schema & Prisma Entity Models

The application manages data with **9 relational tables** in PostgreSQL, accessed via Prisma ORM:

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      Venue      │◄────────┤      Zone       │◄────────┤     Amenity     │
│                 │         │                 │         │                 │
│ id (PK)         │         │ id (PK)         │         │ id (PK)         │
│ name            │         │ venueId (FK)    │         │ zoneId (FK)     │
│ tournamentId    │         │ name            │         │ type            │
│ timezone        │         │ capacity        │         │ name            │
└─────────────────┘         │ currentCount    │         │ status          │
                            │ warningThresh   │         └─────────────────┘
                            │ criticalThresh  │
                            └────────┬────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 ▼                   ▼                   ▼
        ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
        │    Volunteer    │ │    AlertLog     │ │    WasteBin     │
        │                 │ │                 │ │                 │
        │ id (PK)         │ │ id (PK)         │ │ id (PK)         │
        │ name            │ │ zoneId (FK)     │ │ zoneId (FK)     │
        │ role            │ │ threshCrossed   │ │ fillPct         │
        │ zoneAssign (FK) │ │ summary         │ │ lastUpdated     │
        │ passwordHash    │ │ acknowledged    │ └─────────────────┘
        └────────┬────────┘ └─────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │    Incident     │
        │                 │
        │ id (PK)         │
        │ category        │
        │ assignedVol(FK) │
        └─────────────────┘
```

### Prisma Schema Definitions (`prisma/schema.prisma`)
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum StaffRole {
  operator
  volunteer
  admin
}

enum AvailabilityStatus {
  active
  on_break
  offline
}

enum IncidentCategory {
  medical
  security
  facility
  crowd
}

enum IncidentPriority {
  low
  medium
  high
  critical
}

enum IncidentStatus {
  reported
  dispatched
  resolved
}

enum AmenityType {
  restroom
  food_court
  medical_desk
  elevator
  gate
}

enum AmenityStatus {
  operational
  restricted
  closed
}

model Venue {
  id           String   @id @default(uuid())
  name         String
  tournamentId String   @map("tournament_id")
  timezone     String   @default("UTC")
  createdAt    DateTime @default(now()) @map("created_at")
  zones        Zone[]

  @@map("venues")
}

model Zone {
  id                String       @id @default(uuid())
  venueId           String       @map("venue_id")
  venue             Venue        @relation(fields: [venueId], references: [id], onDelete: Cascade)
  name              String
  capacity          Int
  currentCount      Int          @default(0) @map("current_count")
  warningThreshold  Float        @default(0.85) @map("warning_threshold")
  criticalThreshold Float        @default(0.95) @map("critical_threshold")
  geoPolygon        Json?        @map("geo_polygon")
  createdAt         DateTime     @default(now()) @map("created_at")
  amenities         Amenity[]
  volunteers        Volunteer[]
  alerts            AlertLog[]
  wasteBins         WasteBin[]

  @@map("zones")
}

model Volunteer {
  id                String             @id @default(uuid())
  name              String
  preferredLanguage String             @default("en") @map("preferred_language")
  zoneAssignmentId  String?            @map("zone_assignment")
  zone              Zone?              @relation(fields: [zoneAssignmentId], references: [id], onDelete: SetNull)
  availability      AvailabilityStatus @default(offline)
  contactChannel    String             @default("dashboard") @map("contact_channel")
  role              StaffRole          @default(volunteer)
  passwordHash      String?            @map("password_hash")
  incidents         Incident[]
  createdAt         DateTime           @default(now()) @map("created_at")

  @@map("volunteers")
}

model Amenity {
  id                 String        @id @default(uuid())
  zoneId             String        @map("zone_id")
  zone               Zone          @relation(fields: [zoneId], references: [id], onDelete: Cascade)
  type               AmenityType
  name               String
  accessibilityFlags Json?         @map("accessibility_flags")
  status             AmenityStatus @default(operational)
  createdAt          DateTime      @default(now()) @map("created_at")

  @@map("amenities")
}

model Incident {
  id                 String           @id @default(uuid())
  category           IncidentCategory
  zoneId             String?          @map("zone_id")
  priority           IncidentPriority @default(medium)
  status             IncidentStatus   @default(reported)
  assignedVolunteerId String?          @map("assigned_volunteer")
  assignedVolunteer  Volunteer?       @relation(fields: [assignedVolunteerId], references: [id], onDelete: SetNull)
  createdBy          String           @map("created_by")
  description        String
  createdAt          DateTime         @default(now()) @map("created_at")

  @@map("incidents")
}

model ChatLog {
  id                 String   @id @default(uuid())
  sessionId          String   @map("session_id")
  query              String
  detectedLanguage   String   @default("en") @map("detected_language")
  response           String
  groundedSources    Json?    @map("grounded_sources")
  flaggedHallucination Boolean  @default(false) @map("flagged_hallucination")
  createdAt          DateTime @default(now()) @map("created_at")

  @@map("chat_logs")
}

model AlertLog {
  id                String    @id @default(uuid())
  zoneId            String    @map("zone_id")
  zone              Zone      @relation(fields: [zoneId], references: [id], onDelete: Cascade)
  thresholdCrossed  String    @map("threshold_crossed")
  generatedSummary  String    @map("generated_summary")
  recommendedAction String    @map("recommended_action")
  triggeringMetric  Float     @map("triggering_metric")
  acknowledged      Boolean   @default(false)
  acknowledgedBy    String?   @map("acknowledged_by")
  acknowledgedAt    DateTime? @map("acknowledged_at")
  createdAt         DateTime  @default(now()) @map("created_at")

  @@map("alert_logs")
}

model TransportZone {
  id           String   @id @default(uuid())
  name         String
  type         String   // shuttle, parking, metro
  capacity     Int
  currentCount Int      @default(0) @map("current_count")
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("transport_zones")
}

model WasteBin {
  id          String   @id @default(uuid())
  zoneId      String   @map("zone_id")
  zone        Zone     @relation(fields: [zoneId], references: [id], onDelete: Cascade)
  fillPct     Float    @default(0.0) @map("fill_pct")
  lastUpdated DateTime @default(now()) @map("last_updated")

  @@map("waste_bins")
}
```

---

## 📡 Detailed API Endpoint Specifications

### 1. Unified Telemetry Stream (SSE)
Establishes a real-time event connection to stream venue updates.
* **Route**: `GET /api/zones/stream`
* **Headers**:
  * `Content-Type: text/event-stream`
  * `Cache-Control: no-cache, no-transform`
  * `Connection: keep-alive`
* **Response Payload Example (Event: `zone_update`)**:
  ```
  event: zone_update
  data: {"type":"zone_update","zone_id":"z1","zone_name":"Zone A","current_count":1240,"capacity":1500,"pct":0.83}
  ```
* **Response Payload Example (Event: `alert`)**:
  ```
  event: alert
  data: {"type":"alert","zone_id":"z1","zone_name":"Zone A","threshold_crossed":"warning","generated_summary":"Zone A is approach capacity limits.","recommended_action":"Redirect arrivals.","alert_id":"a12","timestamp":"2026-07-19T11:00:00Z"}
  ```

### 2. Fan RAG Chat Assistant
Handles natural language spectator queries.
* **Route**: `POST /api/assistant`
* **Request JSON Schema**:
  ```json
  {
    "session_id": "string (UUID)",
    "query": "string (User query text)",
    "current_zone_id": "string (Optional context zone ID)"
  }
  ```
* **Response JSON Schema**:
  ```json
  {
    "detected_language": "string (ISO code)",
    "answer": "string (Markdown response text)",
    "route": ["string (Array of zone IDs to overlay on map)"],
    "estimated_walk_time_min": "number",
    "grounded_sources": ["string (Array of verified amenity IDs)"]
  }
  ```

### 3. Volunteer Intake Copilot
Transcribes unstructured incident reports into structured formats.
* **Route**: `POST /api/copilot`
* **Request JSON Schema**:
  ```json
  {
    "reporter_id": "string (Volunteer ID)",
    "description": "string (Raw text description)"
  }
  ```
* **Response JSON Schema**:
  ```json
  {
    "draft_incident": {
      "category": "medical | security | facility | crowd",
      "zone_id": "string | null",
      "priority": "low | medium | high | critical",
      "description": "string (Clean summary)"
    },
    "suggested_volunteer": {
      "id": "string",
      "name": "string",
      "language": "string",
      "zone_assignment": "string"
    },
    "dispatch_message_localized": "string (Translated dispatch message)"
  }
  ```

### 4. Alert Acknowledgement
Acknowledges active congestion alerts.
* **Route**: `POST /api/alerts/[id]/ack`
* **Headers**: Auth cookies required
* **Request JSON Schema**:
  ```json
  {
    "operator_name": "string (Acknowledging operator)"
  }
  ```
* **Response JSON Schema**:
  ```json
  {
    "success": true,
    "acknowledged_at": "string (ISO Date)"
  }
  ```

---

## 🛠️ Installation & Setup Runbook

Follow these steps to run the application in a local development environment:

### Prerequisites
* Node.js v18 or later
* Git installed
* A running PostgreSQL database (e.g., Supabase)
* Upstash Redis credentials (optional, falls back to in-memory)

### Step 1: Install Project Dependencies
Clone the repository and install the Node packages:
```bash
git clone https://github.com/Sayyed23/Stadium-Pulse.git
cd Stadium-Pulse/stadium-pulse
npm install
```

### Step 2: Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Fill in the variable values in the `.env` file:
```env
# Database Credentials
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# Upstash Redis Credentials
UPSTASH_REDIS_REST_URL="https://[endpoint].upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"

# Generative AI Credentials
GEMINI_API_KEY="your_google_gemini_api_key"

# Maps API Credentials
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_key"

# JWT cookie authentication secret
SESSION_SECRET="your_shared_hmac_secret"
```

### Step 3: Run Database Migrations
Sync the schema definitions with your database:
```bash
npx prisma db push
```

### Step 4: Seed Database Mock Records
Populate your database with the default venues, stands, amenities, and volunteers:
```bash
npx prisma db seed
```

### Step 5: Start the Development Server
Launch the Next.js development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Comprehensive Testing Runbook

StadiumPulse AI includes a comprehensive test suite that covers warning thresholds, real-time events, chat validation, and rate limiting:

### Executing All Tests
Run the test runner command:
```bash
npm run test
```

### Executing Specific Suites
To run a single test file (e.g., grounding validation tests):
```bash
npx vitest run tests/guardrails.test.ts
```

### Coverage Reports
Generate a code coverage report:
```bash
npx vitest run --coverage
```

The console output will display the test execution summary:
```
✓ tests/auth.test.ts (11 tests)
✓ tests/db.test.ts (2 tests)
✓ tests/api-login.test.ts (6 tests)
✓ tests/api-incidents.test.ts (7 tests)
✓ tests/api-copilot.test.ts (5 tests)
✓ tests/realtime.test.ts (9 tests)
✓ tests/ai-client.test.ts (3 tests)
✓ tests/threshold.test.ts (3 tests)
✓ tests/api-assistant.test.ts (7 tests)
✓ tests/security.test.ts (4 tests)
✓ tests/middleware.test.ts (2 tests)
...
Test Files  21 passed (21)
     Tests  121 passed (121)
  Duration  15.42s
```

---

## 🛡️ Code Quality & Refactoring Standards

The project complies with strict static analysis criteria:
* **Nesting Depth**: Flattened callback chains (maximum 4 levels deep) using helper functions to maintain code modularity.
* **Cognitive Complexity**: Reduced high-complexity functions down to simple, single-responsibility helpers (e.g. Chat window responses and transport statuses).
* **Accessibility**: Replaced custom `progressbar` divs with native `<progress>` elements, and custom `region` roles with semantic HTML5 `<section>` tags.
* **Readonly Safety**: Enforced read-only wrappers (`Readonly<{ ... }>`) for component props and static storage maps.

---

## 🚨 Troubleshooting & Developer Runbook

Common development issues and how to resolve them:

### 1. `SESSION_SECRET environment variable is missing` Error
* **Problem**: The auth server throws a 500 error because the HMAC secret token signature key is missing.
* **Solution**: Ensure your `.env` file defines `SESSION_SECRET`. The system features an automatic code fallback, but the key should be set in production.

### 2. Prisma Connection Pool Timeout
* **Problem**: SSE connections exhaust the database connection pool.
* **Solution**: Verify that database requests go through the unified `EventBroadcaster` singleton (`lib/broadcaster.ts`) instead of opening direct queries inside stream loops.

### 3. Google Maps Failing to Load
* **Problem**: A blank map grid appears with console errors.
* **Solution**: Confirm that your Google Maps API key is set in `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. Check the API console to verify that the **Maps JavaScript API** is enabled.

### 4. Redis Fallback Warning
* **Problem**: `Upstash Redis not configured. Falling back to in-memory rate limiting` appears in logs.
* **Solution**: This is normal in local sandboxes when Upstash keys are omitted. The system automatically switches to the local in-memory token bucket implementation to prevent server crashes.

---

## 📋 Comprehensive Screen-by-Screen User Journey Catalog

The platform is designed around 34 custom UI screen specifications that cover spectator, volunteer, operator, and administrative interactions.

### 1. Unified Authentication & Identity Gateway (`/login`)
- **Visual Design**: Glassmorphic dark card overlay with electric cyan border accents and neon role-badge selectors.
- **Interactions**: Tab-switching interface to change roles. Interactive demo-presets allow developers and reviewers to prefill the login fields in one click.
- **Form Fields**: Dynamic label switcher ("Mobile Number" for fans, "Staff Email / Username" for staff), lock-secured password field, dynamic submit buttons.

### 2. Fan Main Telemetry Dashboard (`/fan`)
- **Visual Design**: Grid-based dashboard showing live indicators for nearby congestion, upcoming shuttle departures, active alerts, and weather.
- **Interactions**: High-contrast layout optimized for outdoor readability. Clickable cards redirect users to specific telemetry detail screens.

### 3. Fan Multilingual AI Assistant (`/fan/assistant`)
- **Visual Design**: Floating chat window showing conversation threads. Custom icon badges distinguish the user from the AI Bot.
- **Interactions**: Interactive text chat with real-time response generation. Provides click-to-highlight route lines on the maps overlay.

### 4. Interactive Venues Map Viewer (`/fan/map`)
- **Visual Design**: Full-screen maps display overlaying polyline paths representing walkways, shuttles, and metros.
- **Interactions**: Floating category tags allow users to filter facilities (restrooms, food courts, medical help). Selectable route paths highlight specific paths on click.

### 5. Indoor Wayfinding Route Directory (`/fan/navigation`)
- **Visual Design**: Vertical step timeline layout with walking time indicators, step distance values, and waypoint flags.
- **Interactions**: Wheelchair-accessible route selectors filter out stairs, prioritizing elevators and ramps.

### 6. Wait-Times & Amenities Feed (`/fan/amenities`)
- **Visual Design**: List cards showing food stalls and restroom lines with waiting-time indicators (e.g., "5 min wait", "20 min wait").
- **Interactions**: Search bar to query specific food options. Sorting options by wait time or walking distance.

### 7. Fan Crowd Density Gauges (`/fan/crowd`)
- **Visual Design**: Stand-by-stand congestion gauges (ranging from green 'open' to flashing red 'overflow').
- **Interactions**: Tapping a stand details historical crowd flow and suggests alternative, less crowded gates.

### 8. Transport & Shuttle Station Scheduler (`/fan/transport`)
- **Visual Design**: Live progress bars for parking lots and countdown timers for shuttle buses.
- **Interactions**: Real-time updates pushed from the SSE broadcaster dynamically adjust wait-times and available parking slot indicators.

### 9. SOS Emergency Help Centre (`/fan/emergency`)
- **Visual Design**: High-contrast emergency interface featuring a large, animated red SOS button.
- **Interactions**: Clicking the SOS button triggers a 3-second abort countdown. Upon expiration, the system captures the device's GPS coordinates and dispatches them to the operations center.

### 10. Operations Master Console (`/ops/dashboard`)
- **Visual Design**: Multi-column desktop control layout with active incident trackers, warning logs, and system maps.
- **Interactions**: Play/pause control for simulated data flow. Incident cards allow operators to dispatch volunteers.

### 11. Ops Alert & Incident Acknowledgement Center (`/ops/alerts`)
- **Visual Design**: Clean tabular view of active stand overflows and facility failures.
- **Interactions**: One-click "Acknowledge" button updates states in the database, silencing audible warning alerts.

### 12. Smart Waste Sustainability Portal (`/ops/sustainability`)
- **Visual Design**: Fill-level bar indicators representing smart trash bins across the venue.
- **Interactions**: Automatic triggers alert operations staff when bin fill levels exceed 85%, prompting garbage clearance tasks.

### 13. Volunteer Shift & Duty Hub (`/volunteer`)
- **Visual Design**: Clean status overview interface showing active assignments, check-in controls, and local shift schedules.
- **Interactions**: Slide-to-check-in toggle changes the volunteer's availability status in the database.

### 14. Voice-Enabled Incident Copilot Workspace (`/volunteer/copilot`)
- **Visual Design**: Side-by-side workspace. Left panel processes natural voice or typed input. Right panel displays the drafted incident ticket in real time.
- **Interactions**: Speak/Type inputs. The copilot parses raw text to determine category, priority, and location, suggesting nearby volunteers for dispatch.
