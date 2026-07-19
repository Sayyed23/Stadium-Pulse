# 🗺️ StadiumPulse AI — Sitemap

> Complete page hierarchy and route structure for the StadiumPulse AI Progressive Web Application.

---

```
StadiumPulse AI (PWA)
│
├── Landing (/)
│   ├── Hero Section
│   ├── About StadiumPulse AI
│   ├── Event Information
│   ├── Language Selector
│   ├── Install PWA
│   ├── Continue as Fan
│   └── Staff Login
│
├── Fan Experience
│   │
│   ├── Dashboard (/fan)
│   │   ├── AI Assistant Widget
│   │   ├── Quick Navigation
│   │   ├── Live Crowd Status
│   │   ├── Transport Status
│   │   ├── Event Schedule
│   │   ├── Emergency Help
│   │   └── Recent Searches
│   │
│   ├── AI Assistant (/fan/assistant)
│   │   ├── Chat
│   │   ├── Voice Assistant
│   │   ├── Suggested Questions
│   │   ├── Conversation History
│   │   └── AI Recommendations
│   │
│   ├── Indoor Navigation (/fan/navigation)
│   │   ├── Interactive Stadium Map
│   │   ├── Route Finder
│   │   ├── Turn-by-Turn Navigation
│   │   ├── Accessibility Routes
│   │   ├── Walking Time
│   │   └── Nearby Places
│   │
│   ├── Stadium Map (/fan/map)
│   │   ├── Gates
│   │   ├── Seating Sections
│   │   ├── Food Courts
│   │   ├── Medical Centers
│   │   ├── Washrooms
│   │   ├── Parking
│   │   ├── Emergency Exits
│   │   └── Accessibility Facilities
│   │
│   ├── Amenities (/fan/amenities)
│   │   ├── Food & Drinks
│   │   ├── Restrooms
│   │   ├── Medical
│   │   ├── ATM
│   │   ├── Merchandise
│   │   └── Water Stations
│   │
│   ├── Live Crowd (/fan/crowd)
│   │   ├── Crowd Heatmap
│   │   ├── Busy Zones
│   │   ├── Suggested Alternate Routes
│   │   └── Waiting Times
│   │
│   ├── Transport (/fan/transport)
│   │   ├── Parking Availability
│   │   ├── Shuttle Status
│   │   ├── Metro Information
│   │   ├── Exit Recommendations
│   │   └── Traffic Updates
│   │
│   ├── Accessibility (/fan/accessibility)
│   │   ├── Wheelchair Routes
│   │   ├── Elevators
│   │   ├── Accessible Seating
│   │   ├── Assistance Request
│   │   └── Hearing Assistance
│   │
│   ├── Notifications (/fan/notifications)
│   │
│   ├── Emergency (/fan/emergency)
│   │   ├── SOS
│   │   ├── Medical Help
│   │   ├── Security Help
│   │   ├── Lost & Found
│   │   └── Emergency Contacts
│   │
│   └── Settings (/fan/settings)
│       ├── Language
│       ├── Accessibility
│       ├── Notifications
│       └── PWA Settings
│
├── Volunteer Portal
│   │
│   ├── Dashboard (/volunteer)
│   │   ├── Assigned Tasks
│   │   ├── Active Incidents
│   │   ├── Availability Status
│   │   ├── Notifications
│   │   └── AI Copilot
│   │
│   ├── Incident Copilot (/volunteer/copilot)
│   │   ├── Report Incident
│   │   ├── AI Extraction
│   │   ├── Suggested Priority
│   │   ├── Suggested Volunteer
│   │   ├── Dispatch Preview
│   │   └── Submit
│   │
│   ├── Incidents (/volunteer/incidents)
│   │   ├── Open
│   │   ├── Assigned
│   │   ├── Completed
│   │   └── Incident Details
│   │
│   ├── Tasks (/volunteer/tasks)
│   │
│   ├── Messages (/volunteer/messages)
│   │
│   ├── Navigation (/volunteer/navigation)
│   │
│   └── Profile (/volunteer/profile)
│
├── Control Room
│   │
│   ├── Dashboard (/ops)
│   │   ├── Live Stadium Status
│   │   ├── AI Situation Feed
│   │   ├── Heatmap
│   │   ├── Active Alerts
│   │   ├── Active Incidents
│   │   ├── Volunteer Status
│   │   └── System Health
│   │
│   ├── Crowd Monitoring (/ops/crowd)
│   │   ├── Zone Heatmap
│   │   ├── Occupancy Charts
│   │   ├── AI Predictions
│   │   └── Historical Trends
│   │
│   ├── Alerts (/ops/alerts)
│   │   ├── Critical
│   │   ├── Warning
│   │   ├── Resolved
│   │   └── Alert Details
│   │
│   ├── Incident Center (/ops/incidents)
│   │   ├── Live Incidents
│   │   ├── Incident Details
│   │   ├── Assign Volunteer
│   │   ├── Status Updates
│   │   └── Incident Timeline
│   │
│   ├── Volunteer Management (/ops/volunteers)
│   │   ├── Live Locations
│   │   ├── Availability
│   │   ├── Assignments
│   │   └── Performance
│   │
│   ├── Sustainability (/ops/sustainability)
│   │   ├── Waste Monitoring
│   │   ├── Parking
│   │   ├── Shuttle Operations
│   │   └── Environmental Metrics
│   │
│   ├── Analytics (/ops/analytics)
│   │   ├── Crowd Analytics
│   │   ├── Incident Analytics
│   │   ├── Response Times
│   │   ├── AI Reports
│   │   └── Export Reports
│   │
│   └── Settings (/ops/settings)
│
├── Admin Portal
│   │
│   ├── Dashboard (/admin)
│   ├── Venue Management (/admin/venues)
│   ├── Event Management (/admin/events)
│   ├── Knowledge Base (/admin/knowledge)
│   ├── AI Prompt Management (/admin/prompts)
│   ├── User Management (/admin/users)
│   ├── Volunteer Management (/admin/volunteers)
│   ├── Roles & Permissions (/admin/roles)
│   ├── Language Management (/admin/languages)
│   ├── Notification Templates (/admin/notifications)
│   ├── Reports (/admin/reports)
│   ├── Audit Logs (/admin/audit)
│   └── System Settings (/admin/system)
│
├── Authentication
│   ├── Login (/login)
│   ├── OTP Verification (/verify)
│   ├── Forgot Password (/forgot-password)
│   └── Logout (/logout)
│
└── Shared Pages
    ├── Profile (/profile)
    ├── Notifications (/notifications)
    ├── Help Center (/help)
    ├── FAQ (/faq)
    ├── Privacy Policy (/privacy)
    ├── Terms of Service (/terms)
    ├── Contact Support (/contact)
    ├── About (/about)
    └── Offline Page (/offline)
```

---

## 📁 Next.js Route Group Mapping

The sitemap above maps to the following Next.js App Router route groups:

| Portal | Route Group | Base Path | Auth |
| :--- | :--- | :--- | :--- |
| **Landing** | `(public)` | `/` | None |
| **Fan Experience** | `(fan)` | `/fan/*` | None (anonymous session) |
| **Volunteer Portal** | `(volunteer)` | `/volunteer/*` | Staff login required |
| **Control Room** | `(ops)` | `/ops/*` | Staff login required |
| **Admin Portal** | `(admin)` | `/admin/*` | Admin role required |
| **Authentication** | `(auth)` | `/login`, `/verify`, etc. | None |
| **Shared Pages** | `(shared)` | `/profile`, `/help`, etc. | Varies |

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/assistant` | Fan AI Assistant (RAG + Grounding) |
| `POST` | `/api/copilot` | Incident Copilot (AI Extraction + Dispatch) |
| `GET` | `/api/zones/stream` | SSE Event Bus (Zone + Alert + Transport updates) |
| `GET` | `/api/transport` | Transport zone status |
| `POST` | `/api/incidents` | Create / manage incidents |
| `GET` | `/api/alerts` | Fetch alert history |
| `POST` | `/api/auth/*` | Authentication endpoints |

---

## 📊 Page Count Summary

| Portal | Pages |
| :--- | :--- |
| Landing | 1 |
| Fan Experience | 11 |
| Volunteer Portal | 7 |
| Control Room | 8 |
| Admin Portal | 13 |
| Authentication | 4 |
| Shared Pages | 9 |
| **Total** | **53** |

---

## ✅ Implementation Status

| Route | Status |
| :--- | :--- |
| `/` (Landing) | ✅ Built |
| `/fan/assistant` | ✅ Built |
| `/fan/map` | ✅ Built |
| `/fan/transport` | ✅ Built |
| `/ops/dashboard` | ✅ Built |
| `/ops/copilot` | ✅ Built |
| `/ops/alerts` | ✅ Built |
| `/ops/incidents` | ✅ Built |
| `/ops/sustainability` | ✅ Built |
| `/ops/login` | ✅ Built |
| `/fan/navigation` | ✅ Built |
| `/fan/amenities` | ✅ Built |
| `/fan/crowd` | ✅ Built |
| `/fan/accessibility` | ✅ Built |
| `/fan/emergency` | ✅ Built |
| `/fan/notifications` | ✅ Built |
| `/fan/settings` | ✅ Built |
| `/volunteer/*` | ✅ Built |
| `/ops/crowd` | ✅ Built |
| `/ops/volunteers` | ✅ Built |
| `/ops/analytics` | ✅ Built |
| `/ops/settings` | ✅ Built |
| `/admin/*` | ✅ Built |
| Shared Pages | ✅ Built |
