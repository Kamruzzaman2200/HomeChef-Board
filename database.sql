-- ==============================================================================
-- HomeChef Board - PostgreSQL Database Schema & Seed Data (Neon PostgreSQL)
-- Small Kitchen Order Preparation Management System
-- Use this file to import directly into Neon PostgreSQL via SQL Editor or psql
-- ==============================================================================

-- 1. Enable UUID Extension (standard on PostgreSQL / Neon)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumerated Types
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "FulfillType" AS ENUM ('PICKUP', 'DELIVERY');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 3. Create Tables

-- Users Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "phone" VARCHAR(50),
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- Menu Items Table
CREATE TABLE IF NOT EXISTS "MenuItem" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "image" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "MenuItem_category_idx" ON "MenuItem"("category");
CREATE INDEX IF NOT EXISTS "MenuItem_available_idx" ON "MenuItem"("available");
CREATE INDEX IF NOT EXISTS "MenuItem_isArchived_idx" ON "MenuItem"("isArchived");

-- Orders Table
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfillDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fulfillTime" VARCHAR(50) NOT NULL,
    "fulfillType" "FulfillType" NOT NULL DEFAULT 'PICKUP',
    "addressNote" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'REQUESTED',
    "total" DECIMAL(10, 2) NOT NULL,
    "notes" TEXT,
    "feedbackRating" INTEGER,
    "feedbackNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_order_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");
CREATE INDEX IF NOT EXISTS "Order_orderDate_idx" ON "Order"("orderDate");
CREATE INDEX IF NOT EXISTS "Order_fulfillDate_idx" ON "Order"("fulfillDate");

-- Order Items Table (Master-Detail with Historical Price Snapshot)
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT,
    "itemNameSnapshot" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL CHECK ("quantity" > 0),
    "unitPrice" DECIMAL(10, 2) NOT NULL,
    CONSTRAINT "fk_orderitem_order" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_orderitem_menuitem" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_menuItemId_idx" ON "OrderItem"("menuItemId");

-- ==============================================================================
-- 4. Initial Seed Data (Demo Chef, Customer, Signature Menu Dishes & Sample Orders)
-- ==============================================================================

-- Passwords below are bcrypt hashes for: 'password123'
INSERT INTO "User" ("id", "name", "email", "phone", "passwordHash", "role")
VALUES
    ('u-chef-01', 'Chef Sarah Jenkins', 'chef@homechef.local', '+1 (555) 234-8901', '$2a$10$78K0bV7Wv3u0pIhy.K2a2OTkM/8XgqjJSm5oHkWnB5JtK0wT6b0uG', 'ADMIN'),
    ('u-cust-01', 'David Miller', 'david.miller@gmail.com', '+1 (555) 876-5432', '$2a$10$78K0bV7Wv3u0pIhy.K2a2OTkM/8XgqjJSm5oHkWnB5JtK0wT6b0uG', 'CUSTOMER'),
    ('u-cust-02', 'Elena Rostova', 'elena.rostova@outlook.com', '+1 (555) 345-6789', '$2a$10$78K0bV7Wv3u0pIhy.K2a2OTkM/8XgqjJSm5oHkWnB5JtK0wT6b0uG', 'CUSTOMER')
ON CONFLICT ("email") DO NOTHING;

-- Signature Kitchen Dishes
INSERT INTO "MenuItem" ("id", "name", "description", "category", "price", "image", "available", "isArchived")
VALUES
    ('m-01', 'Artisan Sourdough Boule', 'Slow-fermented for 36 hours with wild yeast, crispy caramelized crust and open tender crumb.', 'Bakery', 450.00, '/images/sourdough.jpg', true, false),
    ('m-02', 'Braised Beef Short Ribs', 'Tender 12-hour braised grass-fed beef short ribs with rosemary red wine reduction and garlic potato purée.', 'Mains', 1450.00, '/images/short-ribs.jpg', true, false),
    ('m-03', 'Wild Mushroom & Truffle Lasagna', 'Hand-rolled pasta sheets layered with chanterelles, porcini, rich béchamel, and fresh thyme.', 'Mains', 950.00, '/images/lasagna.jpg', true, false),
    ('m-04', 'Lemon Rosemary Roasted Chicken', 'Half farm-raised spatchcock chicken infused with organic lemons, garlic cloves, and garden herbs.', 'Mains', 1150.00, '/images/roasted-chicken.jpg', true, false),
    ('m-05', 'Burrata & Heirloom Tomato Tart', 'Flaky buttery puff pastry loaded with creamy Puglia burrata, balsamic glaze, and fresh basil pesto.', 'Starters', 650.00, '/images/burrata-tart.jpg', true, false),
    ('m-06', 'Basque Burnt Cheesecake', 'Caramelized crust on top with a molten, velvety custard center. Baked fresh daily.', 'Desserts', 450.00, '/images/cheesecake.jpg', true, false),
    ('m-07', 'Weekend Feast Family Pack', 'Feeds 4-5. Includes whole roasted chicken, sourdough boule, truffle potato gratin, and Basque cheesecake.', 'Family Packs', 3850.00, '/images/family-pack.jpg', true, false)
ON CONFLICT ("id") DO NOTHING;

-- Initial Pre-Orders
INSERT INTO "Order" ("id", "userId", "orderDate", "fulfillDate", "fulfillTime", "fulfillType", "addressNote", "status", "total", "notes")
VALUES
    ('ORD-7821', 'u-cust-01', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP, '12:30 PM', 'PICKUP', 'Silver Toyota RAV4, parking bay #2', 'PREPARING', 2400.00, 'Please pack the sourdough in a paper bakery bag.'),
    ('ORD-7822', 'u-cust-02', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP, '01:00 PM', 'DELIVERY', 'Apartment 4B, buzzer code 1245', 'CONFIRMED', 1450.00, 'Extra balsamic reduction on the side.'),
    ('ORD-7823', 'u-cust-01', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', '06:30 PM', 'PICKUP', 'Picked up at kitchen gate', 'COMPLETED', 3900.00, 'Family celebration feast pack.')
ON CONFLICT ("id") DO NOTHING;

-- Order Items with Snapshots
INSERT INTO "OrderItem" ("id", "orderId", "menuItemId", "itemNameSnapshot", "quantity", "unitPrice")
VALUES
    ('oi-101', 'ORD-7821', 'm-02', 'Braised Beef Short Ribs', 1, 1450.00),
    ('oi-102', 'ORD-7821', 'm-01', 'Artisan Sourdough Boule', 2, 450.00),
    ('oi-103', 'ORD-7822', 'm-03', 'Wild Mushroom & Truffle Lasagna', 1, 950.00),
    ('oi-104', 'ORD-7822', 'm-06', 'Basque Burnt Cheesecake', 1, 450.00),
    ('oi-105', 'ORD-7823', 'm-07', 'Weekend Feast Family Pack', 1, 3850.00)
ON CONFLICT ("id") DO NOTHING;
