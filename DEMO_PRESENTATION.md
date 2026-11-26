# HomeChef Board 🍳 - Final Project Demo Presentation
## Small Kitchen Order Prep Management System (Full-Stack Internship Capstone)

---

## 📽️ Slide 1: Project Title & Executive Overview

### **HomeChef Board: Back-Office Order Preparation & Pre-Order System**
- **Presenter / Developer**: Intern Full-Stack Engineer
- **Project Category**: Full-Stack Web Application (Beginner / Beginner+)
- **Domain**: Food & Beverage Micro-Business Management
- **Primary Pattern**: Authentication + CRUD + Search/Filter + Status Workflow Kanban + Kitchen Analytics
- **Live Tech Stack**:
  - **Database**: Serverless PostgreSQL hosted on **Neon** (`neon.tech`)
  - **ORM**: Prisma ORM with relational mapping and database transactions
  - **Backend**: Node.js + Express.js + TypeScript + Zod + Session Auth + Bcrypt
  - **Frontend**: Vue 3 (Composition API) + TypeScript + Vite + Pinia + Tailwind CSS + Lucide Icons

---

## 🎯 Slide 2: Real-World Scenario & Problem Statement

### **The Problem Faced by Home Chefs & Artisanal Micro-Bakers:**
1. **Scattered Pre-Orders**: Home chefs receive orders haphazardly via WhatsApp, Instagram DMs, phone calls, and SMS.
2. **Timing & Batch Chaos**: Different customers request different pickup slots (e.g. 12:30 PM vs 6:00 PM). Baking or braising meals too early leaves food cold; cooking too late causes delays.
3. **No Kitchen Ticket Pipeline**: Without a centralized prep board, chefs lose track of what has been confirmed, what is currently inside the oven, and what is bagged ready at the window.
4. **Avoided Unnecessary Complexity**: Traditional POS systems force complex payment gateways and delivery GPS maps. Home kitchens need a straightforward, focused preparation organizer with pay-upon-pickup / local delivery support.

### **The Solution: HomeChef Board**
A clean, back-office kitchen workflow system that organizes customer scheduled pre-orders into a 6-stage Kanban board with informational server-side pricing, historical receipts, and batch throughput analytics.

---

## 🗄️ Slide 3: Database Design (PostgreSQL on Neon)

### **Why PostgreSQL on Neon?**
- Relational integrity with strict foreign keys and cascading deletion rules.
- Fast, cloud-native serverless connection pooling via SSL.
- Clean database migrations and strongly typed client generation with Prisma ORM.

### **Entity-Relationship Model (Master-Detail with Historical Snapshots)**:
```text
┌──────────────────────┐       1:N       ┌──────────────────────────────┐
│        "User"        ├─────────────────┤           "Order"            │
│ ──────────────────── │                 │ ──────────────────────────── │
│  id: UUID (PK)       │                 │  id: UUID (PK)               │
│  name: String        │                 │  userId: UUID (FK)           │
│  email: String (UQ)  │                 │  fulfillDate: Timestamp      │
│  phone: String       │                 │  fulfillTime: String         │
│  passwordHash: String│                 │  fulfillType: PICKUP|DELIVERY│
│  role: CUSTOMER|ADMIN│                 │  addressNote: Text           │
│  createdAt: Timestamp│                 │  status: OrderStatus Enum    │
│  updatedAt: Timestamp│                 │  total: Decimal(10,2)        │
└──────────────────────┘                 │  notes: Text (Chef notes)    │
                                         │  feedbackRating: Int (1-5)   │
                                         │  feedbackNote: Text          │
                                         │  createdAt: Timestamp        │
                                         └──────────────┬───────────────┘
                                                        │ 1:N
                                         ┌──────────────┴───────────────┐
                                         │         "OrderItem"          │
                                         │ ──────────────────────────── │
                                         │  id: UUID (PK)               │
                                         │  orderId: UUID (FK)          │
                                         │  menuItemId: UUID (FK, NULL) │
                                         │  itemNameSnapshot: String    │
                                         │  quantity: Int (> 0)         │
                                         │  unitPrice: Decimal(10,2)    │
                                         └──────────────┬───────────────┘
                                                        │ N:1 (Optional)
                                         ┌──────────────┴───────────────┐
                                         │          "MenuItem"          │
                                         │ ──────────────────────────── │
                                         │  id: UUID (PK)               │
                                         │  name: String                │
                                         │  category: String            │
                                         │  price: Decimal(10,2)        │
                                         │  image: String               │
                                         │  available: Boolean          │
                                         │  isArchived: Boolean         │
                                         └──────────────────────────────┘
```

### **Key Database Architecture Highlights:**
- **Historical Price Snapshot (`itemNameSnapshot` & `unitPrice`)**:
  When menu prices change or dishes are seasonal, past customer receipts and revenue accounting remain 100% frozen and accurate.
- **Soft Deletion (`isArchived`)**: Menu dishes are never hard-deleted if referenced in prior orders.
- **Direct SQL Export**: `database.sql` / `server/prisma/schema.sql` allows 1-click execution in Neon Console.

---

## ⚙️ Slide 4: Backend Implementation & Business Logic

### **Key Server-Side Mechanisms (Node.js + Express + Prisma + Zod):**
1. **Server-Side Price Calculation**:
   - The server **never trusts client totals**. Prices are fetched directly from the database, multiplied by validated quantities, and summed server-side with thermal box fees.
2. **Transactional Inserts**:
   - `prisma.$transaction()` guarantees that order master records and child order items are written atomically. If any item is invalid or sold out, the entire transaction rolls back.
3. **Status Workflow Engine**:
   - Enforces the 6 stages: `REQUESTED` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `READY` ➔ `COMPLETED` *(or `CANCELLED`)*.
4. **Locking Completed Orders (Requirement 8.8)**:
   - Once an order reaches `COMPLETED` or `CANCELLED`, status transitions are locked. Only kitchen admin notes can be adjusted.
5. **Search & Multi-Filter Querying**:
   - `GET /api/orders` supports dynamic date range filtering, status matching, customer ID scoping, and case-insensitive text search.

---

## 💻 Slide 5: Frontend Architecture (Vue 3 + Pinia + Tailwind)

### **Key UI Features & Pages:**
1. **Main Storefront (`/menu`, `/`)**:
   - Artisan menu cards with badge categories, price tags, and "+ Add to Pre-Order" controls.
2. **Pre-Order Checkout (`/order`)**:
   - Date selection calendar, prep time window selector, fulfillment toggle (Window Pickup vs Courier Delivery), dietary note inputs, and real-time subtotal summary.
3. **Daily Kitchen Prep Board (`/admin/daily-board`)**:
   - Interactive 5-column Kanban pipeline showing active tickets per stage.
   - Quick advance button to progress tickets into oven prep and ready stages.
   - Date selector (Today's Batches, All Scheduled, or custom date picker) + live search.
4. **Chef Analytics Dashboard (`/admin/dashboard`)**:
   - Gross scheduled revenue, active oven batches, counter ready count, and throughput table.
5. **Menu Management CRUD (`/admin/menu-management`)**:
   - Modal dish creator/editor, pricing adjustment, category sorting, and instant **"Available / Sold Out"** toggle.
6. **Order Details & Printable Kitchen Slip (`/orders/:id`)**:
   - Live visual status stepper.
   - **Printable Kitchen Ticket** button (`window.print()`) formatted for kitchen clipboards and thermal printers.
   - **Customer Feedback & Rating** form on completed orders.

---

## 🛡️ Slide 6: Quality, Security & Validation Checklist

| Area | Implementation & Evidence |
|---|---|
| **Input Validation** | Double-sided validation: HTML5/Vue constraints + Zod schemas on backend. |
| **SQL Injection Prevention** | Prisma ORM uses parameterized prepared statements throughout. |
| **Authentication & AuthZ** | `requireAuth` and `requireAdmin` middlewares protect sensitive routes. |
| **Historical Data Safety** | Foreign key snapshotting guarantees receipts remain intact upon dish updates. |
| **Dual-Mode Resiliency** | Seamlessly connects to Neon PostgreSQL; falls back to browser localStorage if offline. |
| **Responsive Design** | Tested and fully responsive from mobile phone screens up to 1440px desktop displays. |

---

## 💡 Slide 7: Lessons Learned & Engineering Takeaways

1. **Master-Detail Data Modeling**:
   - Implementing historical snapshots in `OrderItem` taught the importance of decoupling operational catalogs from historical accounting.
2. **Server-Side Integrity**:
   - Relying on client-calculated amounts is a dangerous anti-pattern. Validating item availability and recalculating totals in a database transaction ensures bulletproof e-commerce workflows.
3. **Workflow UI / Kanban Optimization**:
   - Designing an intuitive kitchen board requires clear visual states, distinct column badges, and minimal clicks to transition batches.
4. **Prisma + PostgreSQL on Serverless Neon**:
   - Working with Neon PostgreSQL demonstrated the power of serverless relational databases with automatic SSL connection pooling.

---

## 🎬 Slide 8: Demo Walkthrough Script (For Mentors)

1. **Step 1: Sign In**: Navigate to `/login`, click the "Chef Admin" or "Customer" quick-fill button, and sign in.
2. **Step 2: Browse Menu & Place Order**: Go to `/order`, choose 2 sourdoughs and a braised beef short rib, pick today's 12:30 PM window, and submit.
3. **Step 3: Chef Daily Board**: Switch to the Chef view (`/admin/daily-board`), locate the new ticket in "New Requested", and advance it to "In Oven / Prep" and then "Ready for Pickup".
4. **Step 4: Print Kitchen Ticket**: Open the ticket details and click "Print Kitchen Ticket" to preview the print slip.
5. **Step 5: Complete & Review**: Mark the order "Completed", switch to Customer view, leave a 5-star review, and view updated Analytics in `/admin/dashboard`.
