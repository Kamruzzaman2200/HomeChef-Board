# TriFin-Loop R&D
## SOFTWARE ENGINEERING INTERNSHIP / PROJECT PRD
### Full-Stack Internship Project | Implemented System Specification

---

**Page 1 of 10**

# PROJECT | PRODUCT REQUIREMENTS DOCUMENT

**HomeChef Board – Small Kitchen Order Prep Management System | PRD v1.0 | November 2026**

---

## Document Control

| Field | Value |
|---|---|
| **Organization** | TriFin-Loop R&D |
| **Project / Owner** | HomeChef Board / Kamruzzaman (Full-Stack Intern) |
| **Status** | Implemented and deployed; submitted for supervisor review |
| **Scope** | Home-based kitchen pre-order management, preparation tracking, and daily workload board |
| **Delivery** | Internship MVP; fully functional full-stack web application |

---

## Executive Summary

HomeChef Board is a full-stack web application that helps a small home-based kitchen organize customer pre-orders, track preparation status through a 6-stage Kanban pipeline, and manage daily workload. Customers can browse the artisan menu, schedule pickup or delivery pre-orders, and track their order status in real time. The Kitchen Admin manages the menu catalog, confirms incoming orders, advances preparation stages, and monitors daily throughput analytics. The system deliberately avoids payment gateway and delivery-map complexity, focusing instead on the core preparation workflow that home chefs need most.

## What This Document Covers

This PRD documents the implemented HomeChef Board system: its problem context, user roles, MVP feature inventory, functional and non-functional requirements, user stories, process flows, screen specifications, database architecture, API design, test plan, and execution timeline. All features described have been built, tested, and deployed to GitHub.

## Version History

| Version | Change |
|---|---|
| 0.1 | Problem definition, feature outline, and database design |
| 0.5 | Core implementation: authentication, menu CRUD, order workflow, and kitchen board |
| 1.0 | Complete MVP with analytics dashboard, BDT pricing, test suite, and documentation |

---

**Page 2 of 10**

# 01 | PROBLEM, USERS & PRODUCT GOALS

*Define why the product exists and how the reviewer can judge its usefulness.*

## Problem Statement

Home-based chefs and artisanal micro-bakers receive pre-orders through scattered channels — WhatsApp messages, Instagram DMs, phone calls, and SMS. Orders contain different menu items, varying quantities, and different pickup or delivery time slots. Without a centralized system, chefs lose track of what has been confirmed, what is currently being prepared in the oven, and what is bagged and ready at the pickup counter. Traditional POS systems impose unnecessary complexity with payment gateways and delivery GPS maps that home kitchens do not need.

HomeChef Board solves this by providing a clean, back-office kitchen workflow system that organizes customer scheduled pre-orders into a visual preparation board with informational server-side pricing, historical receipts, and batch throughput analytics.

## Target Users

| Persona | Need and Primary Action |
|---|---|
| **Customer (User)** | Browse the artisan menu, submit a scheduled pre-order with pickup/delivery preference, and track preparation status until ready for collection. |
| **Kitchen Admin (Chef)** | Manage menu items and pricing, confirm incoming orders, advance preparation stages on the daily Kanban board, and monitor daily revenue and workload metrics. |

## Implemented Outcomes and Success Measures

- **100% of test orders** can be submitted with required fields, validated server-side, and displayed in the correct customer order history with accurate BDT totals.
- A Kitchen Admin can move an order through all 6 lifecycle stages (`REQUESTED` → `CONFIRMED` → `PREPARING` → `READY` → `COMPLETED` or `CANCELLED`) with timestamped status records.
- A customer **cannot** access another customer's orders by manipulating URL parameters; server-side ownership checks enforce access control.
- Historical price snapshots guarantee that past receipts remain accurate regardless of future menu price changes.

## Assumptions Validated

The system uses demonstration accounts for testing; no real payment processing or delivery mapping is integrated. All pricing is informational in Bangladeshi Taka (৳). The application operates in dual-mode: full-stack with Neon PostgreSQL, or standalone with browser localStorage fallback for offline demo scenarios.

---

**Page 3 of 10**

# 02 | SCOPE & MVP FEATURE INVENTORY

*Clear boundaries prevent scope creep and ensure a deliverable, testable application.*

## In Scope — Must Have (Implemented)

| ID | MVP Capability | Status |
|---|---|---|
| F01 | Register and sign in with demonstration accounts; role-based permissions (Customer / Admin) | ✅ Done |
| F02 | Menu CRUD for Kitchen Admin: create, edit, archive dishes with name, category, price, image, and availability toggle | ✅ Done |
| F03 | Customer creates a pre-order selecting one or more menu items with quantities, pickup/delivery preference, fulfill date, time slot, and address/buzzer notes | ✅ Done |
| F04 | Server-side order total calculation with packaging fee (৳ 50); never trusts client-computed amounts | ✅ Done |
| F05 | 6-stage order status workflow: `REQUESTED` → `CONFIRMED` → `PREPARING` → `READY` → `COMPLETED` / `CANCELLED` | ✅ Done |
| F06 | Daily Order Board (Kanban pipeline) with date filtering, status columns, search, and 1-click stage transitions | ✅ Done |
| F07 | Kitchen Dashboard with live analytics: today's gross revenue, active prep batches, ready count, fulfillment breakdown | ✅ Done |
| F08 | Filter orders by date range, status, and search by customer name | ✅ Done |
| F09 | Historical price snapshots: `OrderItem` captures dish name and unit price at moment of purchase | ✅ Done |

## Should Have — Implemented Enhancements

| ID | Enhancement | Status |
|---|---|---|
| E01 | Printable kitchen ticket (thermal-printer-friendly `window.print()` layout) | ✅ Done |
| E02 | Customer feedback: 1–5 star rating and review note on completed orders | ✅ Done |
| E03 | 1-click demo role switcher in navbar (instant Chef ↔ Customer toggle without re-login) | ✅ Done |
| E04 | Menu availability toggle ("Available" / "Sold Out") to prevent kitchen overbooking | ✅ Done |
| E05 | Dual-mode persistence: Neon PostgreSQL or automatic localStorage fallback | ✅ Done |

## Out of Scope

Online payment gateway integration, real delivery GPS/map routing, SMS/email notifications, AI-powered order classification, native mobile apps, and production data migration.

## Acceptance Boundary

The MVP is complete when the full customer-to-kitchen-to-customer workflow is demonstrable using seeded test accounts: a customer can browse the menu, place a pre-order, and track its status; the chef can confirm, prepare, and complete the order on the daily board; and the customer can submit feedback on the completed order.

---

**Page 4 of 10**

# 03 | USER STORIES & PROCESS FLOW

*Translate user goals into scenarios with visible start and end conditions.*

## Core User Stories

- **US-01**: As a customer, I want to browse the artisan menu so that I can choose dishes for my pre-order without needing to message the chef directly.
- **US-02**: As a customer, I want to schedule a pre-order with a pickup time slot so that my food is freshly prepared when I arrive.
- **US-03**: As a customer, I want to track my order's preparation status so that I know when it moves from the oven to the counter.
- **US-04**: As a customer, I want to leave a star rating and review after my order is completed so that the chef receives feedback.
- **US-05**: As a Kitchen Admin, I want to view all incoming orders on a daily board so that I can plan my preparation schedule.
- **US-06**: As a Kitchen Admin, I want to advance orders through preparation stages with a single click so that the board always reflects the kitchen's real state.
- **US-07**: As a Kitchen Admin, I want to manage my menu items (add, edit, archive, toggle availability) so that only currently offered dishes appear to customers.
- **US-08**: As a Kitchen Admin, I want to see today's revenue and active batch counts so that I can gauge my daily workload.

## Example Journey: Pre-Order Lifecycle

1. **Customer signs in** → navigates to the menu page → adds 2× Artisan Sourdough Boule and 1× Braised Beef Short Ribs to the cart.
2. **Customer schedules pre-order** → selects today's date, 12:30 PM pickup window, Curbside Pickup, and adds a note ("Silver Toyota RAV4, parking bay #2") → submits.
3. **System validates** → server fetches current menu prices from the database, calculates subtotal (2 × ৳450 + 1 × ৳1,450 = ৳2,350), adds ৳50 packaging fee, and stores total = ৳2,400 with historical price snapshots.
4. **Order appears** on the Kitchen Admin's Daily Board in the "New Requested" column with status `REQUESTED`.
5. **Chef confirms** → clicks "Confirm" → order moves to `CONFIRMED` column.
6. **Chef begins prep** → clicks "Start Prep" → order moves to `PREPARING` column.
7. **Chef marks ready** → clicks "Mark Ready" → order moves to `READY` column. Customer sees "Ready for Pickup" on their tracking page.
8. **Customer picks up** → Chef clicks "Complete" → order moves to `COMPLETED`.
9. **Customer leaves review** → submits a 5-star rating with a note ("Incredible sourdough!").

## Lifecycle States and Exceptions

**Defined states**: `REQUESTED`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`.

Once an order reaches `COMPLETED` or `CANCELLED`, status transitions are locked. Only Kitchen Admin notes can be updated on completed orders. Invalid form submissions remain unsaved with field-level validation error messages.

---

**Page 5 of 10**

# 04 | FUNCTIONAL REQUIREMENTS

*Use traceable IDs, actor, behavior, and testable acceptance criteria.*

## FR-01 — Authentication & Role Management | Must

**Actor**: Any visitor. **Trigger**: Submit on Login or Register form.
**Behavior**: The system authenticates credentials using bcrypt password verification and creates a server-side session. Role-based routing directs Admin users to the Kitchen Dashboard and Customer users to the Menu storefront. Session middleware protects all authenticated routes.

**Acceptance**: Given valid credentials, the user is signed in and redirected by role. Given invalid credentials, an error message is displayed and no session is created. Demo quick-login buttons populate credentials with a single click.

## FR-02 — Menu CRUD & Availability | Must

**Actor**: Kitchen Admin. **Trigger**: Create, Edit, Archive, or Toggle actions in Menu Management.
**Behavior**: Admin can create dishes with name, description, category, price (BDT), and image URL. Dishes can be edited, soft-archived (never hard-deleted if referenced in prior orders), and toggled between "Available" and "Sold Out" to prevent overbooking.

**Acceptance**: Given a valid dish form, the item appears in the menu catalog. Given a toggle action, the availability status updates immediately. Archived dishes do not appear on the customer menu but remain linked to historical orders.

## FR-03 — Pre-Order Creation with Server-Side Totals | Must

**Actor**: Authenticated Customer. **Trigger**: Submit on Place Pre-Order form.
**Behavior**: The server validates all menu item IDs and quantities, fetches current prices from the database, calculates the total server-side (never trusts client amounts), adds a ৳50 packaging fee, and inserts the order and order items atomically within a Prisma `$transaction()`. Historical price snapshots (`itemNameSnapshot`, `unitPrice`) are captured at the moment of purchase.

**Acceptance**: Given valid items and quantities, exactly one order is created with accurate server-calculated total. Given an invalid menu item ID, the transaction rolls back and an error is returned. Given a sold-out item, the order is rejected.

## FR-04 — Order Status Workflow & Kitchen Board | Must

**Actor**: Kitchen Admin. **Trigger**: 1-click stage transition on the Daily Order Board.
**Behavior**: The admin advances orders through 6 stages: `REQUESTED` → `CONFIRMED` → `PREPARING` → `READY` → `COMPLETED` (or `CANCELLED`). The board displays orders grouped by status column with date filtering, search, and batch counts. Completed/cancelled orders cannot be re-advanced; only admin notes can be edited.

**Acceptance**: Given a valid transition, the order moves to the next column. Given a completed order, status change is denied but notes update succeeds.

## FR-05 — Authorization & Access Control | Must

Every protected API route validates authenticated identity and role on the server, independent of frontend UI hiding. Customers can only view their own orders. Admin-only routes (`POST /api/menu`, `PATCH /api/orders/:id/status`) reject non-admin sessions with 403 Forbidden.

## Traceability

FR-01 maps to screens W-01, API Auth routes, tests T-01/T-02. FR-03 maps to W-05, API Orders, tests T-05/T-06. FR-04 maps to W-03, API Status, tests T-03/T-04.

---

**Page 6 of 10**

# 05 | NON-FUNCTIONAL REQUIREMENTS

*State measurable targets and how they are verified.*

| ID | Requirement and Verification |
|---|---|
| **NFR-01 Security** | Passwords hashed with bcrypt (`cost=10`). Server-side session authentication via `express-session`. Role-based middleware (`requireAuth`, `requireAdmin`) on all protected routes. Prisma ORM uses parameterized prepared statements to prevent SQL injection. Verified through role tampering and direct API access tests. |
| **NFR-02 Performance** | Menu and order list endpoints respond within 2 seconds for the demo dataset. Vite production build optimizes client assets to 234 KB gzipped JS + 40 KB CSS. Verified with browser network timing. |
| **NFR-03 Usability** | Responsive design tested from 360px mobile to 1440px desktop. Tailwind CSS utility classes ensure consistent spacing and typography. 1-click demo shortcuts reduce onboarding friction. Navigation is simple for first-time users. |
| **NFR-04 Reliability** | Prisma `$transaction()` ensures atomic order creation — failed operations do not create partial records. Dual-mode fallback guarantees the app remains functional even when the remote database is unreachable. |
| **NFR-05 Maintainability** | Clean monorepo structure separating `client/` and `server/`. MVC pattern: routes → controllers → services → Prisma ORM. Zod schemas for runtime request validation. TypeScript end-to-end. Environment secrets excluded from Git via `.gitignore`. README documents complete setup. |
| **NFR-06 Data Integrity** | Historical price snapshots in `OrderItem` preserve receipt accuracy. Foreign key constraints with cascading deletion rules maintain referential integrity. Synthetic demo data only — no real customer PII. |

## Dependencies and Constraints

Development requires Node.js v18+, npm v9+, and optionally a Neon PostgreSQL instance. The demo uses synthetic test accounts and seeded menu data. All pricing is informational in BDT (৳) without real payment processing.

---

**Page 7 of 10**

# 06 | UX, SCREENS & WIREFRAMES

*Implemented screen specifications with required elements and behaviors.*

| Screen | Required Elements / Behavior |
|---|---|
| **W-01 Login / Register** | Email and password fields, inline validation errors, server-side session creation, role-based redirect (Admin → Dashboard, Customer → Menu). **1-Click Quick Demo Login** buttons for Chef Admin and Customer personas. |
| **W-02 Home / Menu Storefront** | Hero banner showcasing the kitchen identity. Artisan menu cards with dish image, name, category badge, BDT price tag, description, and "+ Add to Order" action. Category filter tabs (All, Bakery, Mains, Starters, Desserts, Family Packs). |
| **W-03 Daily Kitchen Prep Board (Kanban)** | 5-column interactive pipeline: Requested → Confirmed → Preparing → Ready → Completed. Order tickets show customer name, item count, fulfill time, and total. 1-click stage advance buttons. Date selector (Today / All / Custom). Search by customer name. Batch counts per column. |
| **W-04 Kitchen Analytics Dashboard** | Live metric cards: today's gross revenue (৳), active in-oven prep batches, counter-ready orders, completed count. Fulfillment breakdown (Pickup vs Delivery). Recent orders table. |
| **W-05 Place Pre-Order** | Cart summary with item names, quantities, unit prices, subtotal, packaging fee, and grand total in BDT. Date picker, time slot selector, fulfillment toggle (Curbside Pickup / Courier Delivery), address/buzzer note input, and Submit button with confirmation. |
| **W-06 My Orders / Order Detail** | Order list with status badges, date, total, and item preview. Expandable detail view with full itemized receipt (snapshotted names and prices), live status stepper, chef notes, **Print Kitchen Ticket** button, and **Customer Feedback** form (1–5 stars + review note) for completed orders. |
| **W-07 Menu Management (Admin)** | Dish catalog table/grid with name, category, price (BDT), availability status. Modal editor for creating/editing dishes. Instant "Available / Sold Out" toggle switch. Archive action with confirmation. |

## Design Behavior

Each screen identifies the user role, main action, and loading/empty/error/success states. Customers never see admin controls. Form submission shows clear success or error feedback. Destructive actions (cancel order, archive dish) require confirmation.

## Deliverables

Six application screenshots are included in `/docs/screenshots/`: login screen, analytics dashboard, daily prep board, menu management, pre-order form, and order detail ticket.

---

**Page 8 of 10**

# 07 | ARCHITECTURE, DATA & API

*Technical decisions validated through implementation.*

## Implemented Architecture

Vue 3 frontend (Composition API + Vite + TypeScript) communicates with an Express REST API over HTTP. The API authenticates users via server-side sessions, checks role permissions through middleware, validates request payloads with Zod schemas, and reads/writes PostgreSQL through Prisma ORM. The client includes an automatic localStorage fallback engine for offline demo scenarios.

```
┌─────────────────────────────────────────────────┐
│          Frontend (Vue 3 + Vite + Pinia)        │
│  Components → Stores → API Service → Router    │
│            ↓ fallback ↓                         │
│        localStorage Mock Engine                 │
└──────────────────────┬──────────────────────────┘
                       │ REST API (HTTP)
┌──────────────────────┴──────────────────────────┐
│      Backend (Node.js + Express + TypeScript)    │
│  Routes → Middleware → Controllers → Services   │
│                       ↓                         │
│              Prisma ORM Client                  │
└──────────────────────┬──────────────────────────┘
                       │ Connection Pool + SSL
┌──────────────────────┴──────────────────────────┐
│        Neon Serverless PostgreSQL                │
│  Users | MenuItems | Orders | OrderItems        │
└─────────────────────────────────────────────────┘
```

## Core Data Entities (Prisma Schema)

```
User(id, name, email, phone, passwordHash, role:CUSTOMER|ADMIN, createdAt, updatedAt)
    ↓ 1:N
Order(id, userId:FK, orderDate, fulfillDate, fulfillTime, fulfillType:PICKUP|DELIVERY,
      addressNote, status:OrderStatus, total:Decimal, notes, feedbackRating, feedbackNote)
    ↓ 1:N
OrderItem(id, orderId:FK, menuItemId:FK|NULL, itemNameSnapshot, quantity, unitPrice:Decimal)
    ↑ N:1 (Optional)
MenuItem(id, name, description, category, price:Decimal, image, available, isArchived)
```

**Key design**: `OrderItem.itemNameSnapshot` and `OrderItem.unitPrice` freeze the dish name and price at the moment of sale, ensuring historical receipt accuracy even after menu changes.

## Implemented API Endpoints

| Endpoint | Method | Access | Purpose |
|---|---|---|---|
| `/api/auth/register` | POST | Public | Register a new customer account |
| `/api/auth/login` | POST | Public | Authenticate with email and password |
| `/api/auth/logout` | POST | Auth | Destroy the active session |
| `/api/auth/me` | GET | Auth | Return currently signed-in user profile |
| `/api/auth/demo-switch` | POST | Public | Quick-switch between Chef and Customer |
| `/api/menu` | GET | Public | List menu items (supports `?category=` and `?available=` filters) |
| `/api/menu/:id` | GET | Public | Get single menu item details |
| `/api/menu` | POST | Admin | Create a new menu dish |
| `/api/menu/:id` | PUT/PATCH | Admin | Update or partially update a dish |
| `/api/menu/:id/toggle` | PATCH | Admin | Toggle dish availability |
| `/api/menu/:id` | DELETE | Admin | Soft-archive a dish |
| `/api/orders` | GET | Auth | List orders (Admin: all; Customer: own; supports filters) |
| `/api/orders/:id` | GET | Auth | Get order with itemized receipt snapshot |
| `/api/orders` | POST | Customer | Submit a pre-order with server-calculated total |
| `/api/orders/:id/status` | PATCH | Admin | Advance order status through the pipeline |
| `/api/orders/:id/notes` | PATCH | Admin | Update chef preparation notes |
| `/api/orders/:id/feedback` | PATCH | Customer | Submit 1–5 star rating and review |
| `/api/dashboard/summary` | GET | Admin | Kitchen KPIs: revenue, batches, ready count |
| `/api/health` | GET | Public | System status and uptime |

---

**Page 9 of 10**

# 08 | TEST PLAN & TRACEABILITY

*Demonstrate how each important requirement is checked.*

| Test / Requirement | Steps and Expected Outcome |
|---|---|
| **T-01 / FR-01** | Valid customer submits registration with required fields; account is created and session is established. ✅ Passed |
| **T-02 / FR-01** | Invalid email format or password shorter than 6 characters returns field-level validation error; no account is created. ✅ Passed |
| **T-03 / FR-03** | Valid order payload with menu items and quantities parses cleanly; order appears in customer history with server-calculated total. ✅ Passed |
| **T-04 / FR-03** | Empty item array is rejected; negative quantity is rejected; missing fulfill time is rejected. Database record count unchanged. ✅ Passed |
| **T-05 / FR-04** | All 6 valid status values are accepted by the status transition endpoint. Invalid status name is rejected. ✅ Passed |
| **T-06 / FR-04** | Chef notes update is accepted on completed orders. Customer feedback (1–5 stars) is accepted; rating above 5 is rejected. ✅ Passed |
| **T-07 / FR-02** | Valid menu item schema is accepted; negative price is rejected; item name shorter than 2 characters is rejected. ✅ Passed |
| **T-08 / FR-03** | Server-side total calculation produces accurate result: 2× ৳450 + 1× ৳1,450 + ৳50 packaging = ৳2,400. Historical snapshot preserves item name and unit price correctly. ✅ Passed |
| **T-09 / NFR-05** | All required deliverable files exist: `database.sql`, `schema.sql`, `schema.prisma`, `README.md`, `DEMO_PRESENTATION.md`, and 6 screenshots. ✅ Passed |

## Test Evidence Summary

**Test suite**: `npm test` runs `scripts/verify-all.js` — a comprehensive verification suite covering order validation, status transitions, menu validation, authentication, server-side totals, snapshot fidelity, and deliverables verification.

**Result**: **34 tests passed, 0 failed.**

## Definition of Done for a Feature

Code is committed to `main`, the production build (`vue-tsc && vite build` for client, `tsc` for server) completes with zero errors, all 34 tests pass, validation and permission checks are in place, and the README documents the implemented behavior.

---

**Page 10 of 10**

# 09 | EXECUTION PLAN, RISKS & HANDOVER

*Turn the document into a realistic implementation record.*

## Implementation Sequence (Completed)

| Milestone | Deliverable | Status |
|---|---|---|
| **M1 — Foundation** | Repository setup, Neon PostgreSQL schema, Prisma ORM, authentication with bcrypt + sessions, role-based middleware | ✅ Done |
| **M2 — Menu & Storefront** | Menu CRUD for admin, artisan menu cards with categories and BDT pricing, local image assets | ✅ Done |
| **M3 — Order Workflow** | Pre-order cart and scheduling form, server-side total calculation, transactional order creation with price snapshots | ✅ Done |
| **M4 — Kitchen Board** | Daily Kanban prep board with 5 status columns, 1-click stage transitions, date/status filters, and search | ✅ Done |
| **M5 — Analytics & Polish** | Kitchen dashboard metrics, customer feedback system, printable tickets, responsive design, dual-mode fallback | ✅ Done |
| **M6 — Quality & Delivery** | Test suite (34 tests), README, demo presentation, screenshots, BDT currency normalization, GitHub deployment | ✅ Done |

## Risks Encountered and Mitigations

| Risk | Mitigation Applied |
|---|---|
| **Scope creep** | Deferred payment gateway, delivery maps, and SMS notifications. Focused on core preparation workflow. |
| **Remote database unavailability** | Implemented dual-mode architecture: server-side fallback menu items + client-side localStorage mock engine ensure the app always works. |
| **Stale cached pricing** | Built automatic client-side cache migration with version tracking (`CURRENT_DATA_VERSION`) and name-based price sanitization. Any cached USD values are auto-converted to BDT on page load. |
| **CDN image failures** | Bundled all dish and banner images locally in `client/public/images/` to eliminate third-party dependency. |
| **Historical receipt corruption** | `OrderItem` captures `itemNameSnapshot` and `unitPrice` at time of sale, decoupling receipts from future menu changes. |

## Technology Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend | Vue 3 (Composition API) + TypeScript + Vite | 3.5 / 5.7 / 6.1 |
| Styling | Tailwind CSS + Lucide Icons | 3.4 / 0.475 |
| State | Pinia + Vue Router | 3.0 / 4.5 |
| Backend | Node.js + Express + TypeScript | 4.21 / 5.7 |
| ORM | Prisma | 6.4 |
| Database | Neon Serverless PostgreSQL | Cloud |
| Validation | Zod | 3.24 |
| Security | bcryptjs + express-session | 3.0 / 1.18 |

## Demo Credentials

| Role | Name | Email | Password |
|---|---|---|---|
| 🍳 Kitchen Admin | Chef Sarah Jenkins | `chef@homechef.local` | `password123` |
| 🥐 Customer 1 | David Miller | `david.miller@gmail.com` | `password123` |
| 🥐 Customer 2 | Elena Rostova | `elena.rostova@outlook.com` | `password123` |

## Submission Package

| Item | Location |
|---|---|
| Source code repository | [github.com/Kamruzzaman2200/HomeChef-Board](https://github.com/Kamruzzaman2200/HomeChef-Board) |
| Database schema export | `/database.sql` and `/server/prisma/schema.sql` |
| Prisma schema | `/server/prisma/schema.prisma` |
| README with setup instructions | `/README.md` |
| Demo presentation guide | `/DEMO_PRESENTATION.md` |
| PRD document | `/docs/HomeChef_Board_PRD_v1.0.md` |
| Screenshots (6) | `/docs/screenshots/01-login-screen.png` through `06-order-details-ticket.png` |

## Submission Filename

`HomeChef_Board_Kamruzzaman_PRD_v1.0.pdf`

Repository: `/docs/HomeChef_Board_PRD_v1.0.md`, `/docs/screenshots/`, `README.md`, and `DEMO_PRESENTATION.md`.

Submit via GitHub and share the link through the internship WhatsApp channel.
