# HomeChef Board 🍳

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

> A modern, full-stack kitchen order preparation and pre-order management system tailored for home-based culinary entrepreneurs, artisanal micro-bakers, and chef pre-order operations.

---

## 📑 Table of Contents

- [🌟 Features & Capabilities](#-features--capabilities)
- [🏗️ System Architecture & Workflow](#️-system-architecture--workflow)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Monorepo Project Structure](#-monorepo-project-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Installation](#2-installation)
  - [3. Neon PostgreSQL & Prisma Setup](#3-neon-postgresql--prisma-setup)
  - [4. Running the Development Servers](#4-running-the-development-servers)
- [📡 REST API Reference](#-rest-api-reference)
- [🗄️ Database Schema & Data Integrity](#️-database-schema--data-integrity)
- [👥 Demo Accounts & Testing](#-demo-accounts--testing)
- [🚢 Production Deployment](#-production-deployment)
- [📄 License](#-license)

---

## 🌟 Features & Capabilities

### 🍳 For Chefs & Kitchen Managers (Admin)
- **Daily Kitchen Prep Board (Kanban Pipeline)**: Real-time visual tracking of orders through 6 progressive stages:
  $$\text{REQUESTED} \longrightarrow \text{CONFIRMED} \longrightarrow \text{PREPARING} \longrightarrow \text{READY} \longrightarrow \text{COMPLETED} \quad (\text{or } \text{CANCELLED})$$
- **1-Click Stage Transitions**: Advance order tickets with a single click as dishes move into the oven, to packaging, and to the pickup counter.
- **Kitchen Throughput Analytics**: Live metrics tracking today's gross revenue, active in-oven prep batches, window-ready orders, and fulfillment breakdown.
- **Menu Catalog Management**: Add signature dishes, adjust prices, edit descriptions, upload food imagery, and instantly toggle between **"Available"** and **"Sold Out"** to prevent kitchen overbooking.

### 🥐 For Customers & Foodies
- **Frictionless Pre-Order Scheduling**: Browse artisanal offerings, select fulfillment date and pickup/delivery time slots, and specify dietary or buzzer/vehicle notes.
- **Order Tracking & Digital Receipts**: Follow the live preparation status of orders from confirmation through ready-for-pickup.
- **Immutable Historical Receipts**: Dish names and unit prices are snapshotted at moment of purchase, preserving past receipt accuracy regardless of future menu adjustments.

### ⚡ Developer Experience & Dual-Mode Architecture
- **Dual-Mode Persistence**: Operates as a full-stack system connected to Neon PostgreSQL, or runs standalone in the browser with automatic fallback to `localStorage` and realistic demo mock datasets.
- **1-Click Demo Role Switcher**: Interactive switcher directly in the navbar allows instantaneous toggling between **Chef Admin** and **Customer** personas without re-authenticating.

---

## 🏗️ System Architecture & Workflow

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Vue 3 + Vite)"]
        UI["Vue Components & Pages"]
        Pinia["Pinia Stores (Auth, Cart, Orders, Menu)"]
        Router["Vue Router (Guards & Dynamic Layouts)"]
        APIClient["API Service Layer (Fetch + Fallback)"]
        LocalData["LocalStorage + Mock Fallback Data"]
        UI --> Pinia
        Pinia --> APIClient
        APIClient -.->|If Offline / Standalone| LocalData
    end

    subgraph Server["Backend Server (Node.js + Express)"]
        Express["Express API Gateway"]
        AuthMiddleware["Session & Role Middleware"]
        Controllers["Controllers (Auth, Menu, Order, Dashboard)"]
        Services["Business Services & Transactions"]
        PrismaClient["Prisma ORM Client"]
        Express --> AuthMiddleware
        AuthMiddleware --> Controllers
        Controllers --> Services
        Services --> PrismaClient
    end

    subgraph Database["Database (PostgreSQL)"]
        NeonDB[("Neon Serverless PostgreSQL\n• Users & Roles\n• Menu Catalog\n• Orders & Historical Snapshots")]
        PrismaClient -->|Connection Pool / SSL| NeonDB
    end

    APIClient -->|HTTP / REST JSON (Proxy /api)| Express
```

---

## 🛠️ Technology Stack

| Domain | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | Vue 3 | `^3.5.13` | Reactive UI using Composition API & `<script setup>` |
| **Build & Dev Tool** | Vite | `^6.1.1` | Ultra-fast HMR and optimized production bundling |
| **Language** | TypeScript | `^5.7.3` | End-to-end type safety across client and server |
| **Styling & Theme** | Tailwind CSS | `^3.4.17` | Kitchen-warm aesthetic (`cream`, `terracotta`, `sage`) |
| **Icons** | Lucide Vue Next | `^0.475.0` | Crisp modern iconography for orders, timers, and chefs |
| **State Management** | Pinia | `^3.0.1` | Modular state for authentication, cart, orders, and menu |
| **Client Routing** | Vue Router | `^4.5.0` | History mode navigation with role-based layout switches |
| **Backend Runtime** | Node.js + Express | `^4.21.2` | RESTful API server with TypeScript execution (`tsx`) |
| **Database** | Neon PostgreSQL | Serverless | Cloud-native serverless PostgreSQL instance |
| **ORM** | Prisma ORM | `^6.4.1` | Schema migrations, query builder, and relations |
| **Data Validation** | Zod | `^3.24.2` | Runtime request body schema validation |
| **Security & Sessions** | Express Session + Bcrypt | `^1.18.1` / `^3.0.2` | Cookie session management & password hashing |

---

## 📁 Monorepo Project Structure

```text
homechef-board/
├── client/                           # Vue 3 Frontend Application
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── assets/                   # Tailwind CSS root styling
│   │   ├── components/
│   │   │   ├── layout/               # Navbar, Sidebar, Footer components
│   │   │   ├── menu/                 # MenuCard, MenuGrid, CategoryFilter
│   │   │   ├── orders/               # OrderCard (Kanban ticket), StatusBadge
│   │   │   └── ui/                   # Reusable Button, Input, Card, Modal, Badge
│   │   ├── layouts/
│   │   │   ├── AdminLayout.vue       # Chef dashboard layout with sidebar
│   │   │   └── CustomerLayout.vue    # Storefront consumer header and layout
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── DailyOrderBoard.vue  # Interactive Kitchen Prep Kanban
│   │   │   │   ├── Dashboard.vue        # Kitchen throughput metrics & stats
│   │   │   │   └── MenuManagement.vue   # Dish editor & availability toggles
│   │   │   ├── auth/
│   │   │   │   ├── Login.vue            # Sign-in page with demo shortcuts
│   │   │   │   └── Register.vue         # Account registration
│   │   │   ├── customer/
│   │   │   │   ├── MyOrders.vue         # Customer order tracking
│   │   │   │   ├── OrderDetail.vue      # Itemized receipt & time slot view
│   │   │   │   └── PlaceOrder.vue       # Pre-order cart & scheduling checkout
│   │   │   └── Home.vue              # Main menu showcase & kitchen intro
│   │   ├── router/                   # Vue Router map & page title guards
│   │   ├── services/
│   │   │   ├── api.ts                # Unified API client with offline fallback
│   │   │   └── mockData.ts           # Rich kitchen demo seed data
│   │   ├── stores/                   # Pinia stores: auth, cart, menu, order
│   │   ├── types/                    # Domain TypeScript models
│   │   ├── App.vue                   # Root dynamic layout resolver
│   │   └── main.ts                   # App entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts                # Vite config with /api dev proxy
│
├── server/                           # Express + Prisma Backend API
│   ├── prisma/
│   │   └── schema.prisma             # PostgreSQL schema (Models, Enums, Relations)
│   ├── src/
│   │   ├── config/
│   │   │   ├── prisma.ts             # Prisma client singleton
│   │   │   └── seed.ts               # Database seeder for demo accounts & dishes
│   │   ├── controllers/              # Request handlers (Auth, Menu, Order, Dashboard)
│   │   ├── middleware/               # Session auth, requireAdmin, errorHandler
│   │   ├── routes/                   # Route modules
│   │   ├── services/                 # Database transactional logic
│   │   ├── validators/               # Zod validation schemas
│   │   └── app.ts                    # Express server initialization
│   ├── .env.example                  # Backend environment template
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                        # Git exclusion rules
├── package.json                      # Monorepo root workspace scripts
└── README.md                         # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL Database** *(optional for local demo; required for full backend persistence)*: e.g. Free tier at [Neon.tech](https://neon.tech)

---

### 2. Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/Kamruzzaman2200/HomeChef-Board.git
cd HomeChef-Board

# Install all workspace dependencies (root, client, and server)
npm run install:all
```

---

### 3. Neon PostgreSQL & Prisma Setup

*(Skip this step if you just want to run the standalone frontend with built-in mock database!)*

#### Step A: Configure Server Environment
Copy the environment template in `server/`:

```bash
# On Linux/macOS:
cp server/.env.example server/.env

# On Windows (PowerShell):
copy server\.env.example server\.env
```

Open `server/.env` and update your database credentials:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Connect to your Neon PostgreSQL instance
DATABASE_URL="postgresql://[user]:[password]@[neon-hostname]/neondb?sslmode=require"

# Random session encryption key
SESSION_SECRET="homechef_kitchen_secret_session_key_2026"
```

#### Step B: Generate Prisma Client & Push Schema
Run Prisma migration to create the tables on Neon:

```bash
# Generate the Prisma TypeScript client
npm run prisma:generate

# Push schema directly to your PostgreSQL database
npm --prefix server run prisma:deploy
# or: npx --prefix server prisma db push
```

#### Step C: Seed Demo Data
Populate the initial chef account, demo customer, and signature kitchen menu items:

```bash
npm run seed
```

---

### 4. Running the Development Servers

You can launch the frontend and backend with the monorepo root scripts:

```bash
# Terminal 1: Start Vue 3 Client (http://localhost:5173)
npm run dev:client

# Terminal 2: Start Express Backend API (http://localhost:5000)
npm run dev:server
```

> **💡 Zero-Config Standalone Mode**: If you start `npm run dev:client` without running the backend server, the application automatically activates its **Offline Mock Engine**, persisting your orders, status changes, and menu edits directly in browser `localStorage`.

---

## 📡 REST API Reference

All backend routes are exposed under the `/api` prefix.

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate with email and password |
| `POST` | `/api/auth/logout` | Authenticated | Destroy the active session |
| `GET` | `/api/auth/me` | Authenticated | Return the currently signed-in user profile |
| `POST` | `/api/auth/demo-switch` | Public | Quick-switch session between Chef and Customer |

### 🍽️ Menu Catalog (`/api/menu`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/menu` | Public | List menu items (supports `?category=` and `?available=`) |
| `GET` | `/api/menu/:id` | Public | Get single menu item details |
| `POST` | `/api/menu` | Chef / Admin | Create a new signature menu dish |
| `PUT` | `/api/menu/:id` | Chef / Admin | Update dish information, description, or price |
| `PATCH`| `/api/menu/:id/toggle` | Chef / Admin | Quick-toggle dish availability (Available / Sold Out) |
| `DELETE`| `/api/menu/:id` | Chef / Admin | Archive dish from the menu catalog |

### 📦 Pre-Orders & Kanban (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/orders` | Auth (Role-based) | List orders (Chef sees all; Customer sees own) |
| `GET` | `/api/orders/:id` | Auth | Get order by ID with itemized receipt snapshot |
| `POST` | `/api/orders` | Customer / Auth | Submit a scheduled pre-order with time slot & notes |
| `PATCH`| `/api/orders/:id/status` | Chef / Admin | Advance order status (`CONFIRMED`, `PREPARING`, `READY`, etc.) |

### 📊 Kitchen Dashboard & Health (`/api/dashboard`, `/api/health`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/summary` | Chef / Admin | Kitchen KPIs: today's revenue, active batches, ready count |
| `GET` | `/api/health` | Public | System status, uptime timestamp, and environment |

---

## 🗄️ Database Schema & Data Integrity

The system is modeled in `server/prisma/schema.prisma` with strict relations:

```text
┌─────────────────┐       1:N       ┌─────────────────┐
│      User       ├─────────────────┤      Order      │
│  (ADMIN/CUST)   │                 │ (Status/Slots)  │
└─────────────────┘                 └────────┬────────┘
                                             │ 1:N
                                    ┌────────┴────────┐
                                    │    OrderItem    │
                                    │(Price Snapshot) │
                                    └────────┬────────┘
                                             │ N:1 (Optional)
                                    ┌────────┴────────┐
                                    │    MenuItem     │
                                    │(Catalog Dishes) │
                                    └─────────────────┘
```

### 🛡️ Why Historical Price Snapshots Matter
In a commercial food business, ingredient prices fluctuate and seasonal items are frequently altered.
In **HomeChef Board**, the `OrderItem` model captures:
- `itemNameSnapshot`: Exact name of the dish at time of sale.
- `unitPrice`: Decimal unit price locked in at moment of order.
- `quantity`: Number of portions ordered.

Even if the chef raises prices or archives a dish next week, past customer receipts, tax reports, and revenue accounting remain 100% accurate and unaltered.

---

## 👥 Demo Accounts & Testing

The application provides pre-configured credentials and an instant 1-click role switcher in the navbar:

| Role | Email | Password | Permissions & Test Workflows |
|---|---|---|---|
| **Chef Admin** | `chef@homechef.local` | `password123` | • Manage daily Kanban prep pipeline<br>• View kitchen revenue & throughput metrics<br>• Add/edit dishes & toggle sold-out status |
| **Customer** | `david.miller@gmail.com` | `password123` | • Browse seasonal kitchen pre-orders<br>• Schedule pickup/delivery dates & time slots<br>• Track live prep status & view receipts |

---

## 🚢 Production Deployment

### Frontend (Vercel or Netlify)
1. Fork or push this repository to GitHub.
2. In Vercel, import the repo and configure:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. If hosting the backend separately, set an environment variable or configure reverse proxy routing to your backend server.

### Backend (Render, Railway, or VPS)
1. Create a Web Service pointing to the repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command**:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
4. Set **Start Command**:
   ```bash
   node dist/app.js
   ```
5. Set environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL pooled connection string.
   - `SESSION_SECRET`: A secure random secret string.
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: The production URL of your frontend (e.g. `https://homechef-board.vercel.app`).

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
