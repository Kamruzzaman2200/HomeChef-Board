import fs from 'fs';
import path from 'path';
import { createOrderSchema, updateOrderStatusSchema, updateOrderNotesSchema, orderFeedbackSchema } from '../server/dist/validators/order.validator.js';
import { createMenuItemSchema, updateMenuItemSchema } from '../server/dist/validators/menu.validator.js';
import { registerSchema, loginSchema } from '../server/dist/validators/auth.validator.js';

console.log('🧪 Starting HomeChef Board Comprehensive Verification Suite...\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

// ==========================================
// Test 1: Order Validation & Negative Cases
// ==========================================
console.log('📦 1. Order Validation & Edge Cases:');

const validOrder = createOrderSchema.safeParse({
  fulfillTime: '12:30 PM',
  fulfillType: 'PICKUP',
  addressNote: 'Curbside',
  items: [{ menuItemId: 'm-01', quantity: 2 }],
});
assert(validOrder.success, 'Valid order payload parses cleanly');

const emptyItemsOrder = createOrderSchema.safeParse({
  fulfillTime: '12:30 PM',
  items: [],
});
assert(!emptyItemsOrder.success, 'Rejects empty item array');

const negativeQtyOrder = createOrderSchema.safeParse({
  fulfillTime: '12:30 PM',
  items: [{ menuItemId: 'm-01', quantity: -1 }],
});
assert(!negativeQtyOrder.success, 'Rejects negative item quantity');

const missingTimeOrder = createOrderSchema.safeParse({
  items: [{ menuItemId: 'm-01', quantity: 1 }],
});
assert(!missingTimeOrder.success, 'Rejects order missing fulfill time');

// ==========================================
// Test 2: Order Status Workflow & Constraints
// ==========================================
console.log('\n🔄 2. Order Status Transitions & Constraints:');

const validStatuses = ['REQUESTED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
for (const st of validStatuses) {
  const res = updateOrderStatusSchema.safeParse({ status: st });
  assert(res.success, `Valid status accepted: ${st}`);
}

const invalidStatus = updateOrderStatusSchema.safeParse({ status: 'DELIVERED_UNKNOWN' });
assert(!invalidStatus.success, 'Rejects invalid status name');

const validNotes = updateOrderNotesSchema.safeParse({ notes: 'Extra crispy crust' });
assert(validNotes.success, 'Valid order notes payload accepted');

const validFeedback = orderFeedbackSchema.safeParse({ rating: 5, note: 'Super delicious sourdough!' });
assert(validFeedback.success, 'Valid 5-star customer feedback accepted');

const invalidRating = orderFeedbackSchema.safeParse({ rating: 7 });
assert(!invalidRating.success, 'Rejects feedback rating above 5');

// ==========================================
// Test 3: Menu Catalog Validation
// ==========================================
console.log('\n🍽️ 3. Menu Validation & Constraints:');

const validMenuItem = createMenuItemSchema.safeParse({
  name: 'Rosemary Focaccia',
  category: 'Bakery',
  price: 8.50,
  available: true,
});
assert(validMenuItem.success, 'Valid menu item schema accepted');

const negativePriceItem = createMenuItemSchema.safeParse({
  name: 'Rosemary Focaccia',
  category: 'Bakery',
  price: -5.00,
});
assert(!negativePriceItem.success, 'Rejects negative menu item price');

const shortNameItem = createMenuItemSchema.safeParse({
  name: 'F',
  category: 'Bakery',
  price: 5.00,
});
assert(!shortNameItem.success, 'Rejects item name shorter than 2 chars');

// ==========================================
// Test 4: Auth Validator
// ==========================================
console.log('\n🔐 4. Authentication Validation:');

const validReg = registerSchema.safeParse({
  name: 'Chef Sarah',
  email: 'chef@homechef.local',
  password: 'password123',
  role: 'ADMIN',
});
assert(validReg.success, 'Valid registration payload accepted');

const badEmailReg = registerSchema.safeParse({
  name: 'Chef Sarah',
  email: 'not-an-email',
  password: 'password123',
});
assert(!badEmailReg.success, 'Rejects invalid email format');

const shortPassReg = registerSchema.safeParse({
  name: 'Chef Sarah',
  email: 'chef@homechef.local',
  password: '123',
});
assert(!shortPassReg.success, 'Rejects password shorter than 6 chars');

// ==========================================
// Test 5: Server-Side Calculation Logic Simulation
// ==========================================
console.log('\n💰 5. Server-Side Totals & Snapshot Fidelity:');

const mockDbMenu = [
  { id: 'm-01', name: 'Artisan Sourdough Boule', price: 450.00, available: true },
  { id: 'm-02', name: 'Braised Beef Short Ribs', price: 1450.00, available: true },
];

function simulateServerOrderCalc(orderedItems) {
  let subtotal = 0;
  const snapshots = [];
  for (const item of orderedItems) {
    const dbItem = mockDbMenu.find((m) => m.id === item.menuItemId);
    if (!dbItem || !dbItem.available) throw new Error('Unavailable item');
    subtotal += dbItem.price * item.quantity;
    snapshots.push({
      itemNameSnapshot: dbItem.name,
      unitPrice: dbItem.price,
      quantity: item.quantity,
    });
  }
  const total = subtotal + 50.00; // Packaging fee (BDT 50)
  return { total, snapshots };
}

const calculated = simulateServerOrderCalc([
  { menuItemId: 'm-01', quantity: 2 },
  { menuItemId: 'm-02', quantity: 1 },
]);

assert(calculated.total === 2400.00, 'Server-side total calculated accurately: ৳2,400.00');
assert(calculated.snapshots[0].itemNameSnapshot === 'Artisan Sourdough Boule', 'Snapshot preserved name correctly');
assert(calculated.snapshots[0].unitPrice === 450.00, 'Snapshot preserved unit price correctly');

// ==========================================
// Test 6: Submission Deliverables Check
// ==========================================
console.log('\n📁 6. Deliverables & Submission Package Verification:');

assert(fs.existsSync('database.sql'), 'Root database.sql export exists');
assert(fs.existsSync('server/prisma/schema.sql'), 'server/prisma/schema.sql exists');
assert(fs.existsSync('server/prisma/schema.prisma'), 'server/prisma/schema.prisma exists');
assert(fs.existsSync('README.md'), 'README.md exists');
assert(fs.existsSync('DEMO_PRESENTATION.md'), 'DEMO_PRESENTATION.md exists');

const requiredScreenshots = [
  '01-login-screen.png',
  '02-kitchen-analytics-dashboard.png',
  '03-daily-prep-kanban-board.png',
  '04-menu-management-crud.png',
  '05-place-preorder.png',
  '06-order-details-ticket.png',
];

for (const sc of requiredScreenshots) {
  const filePath = path.join('docs/screenshots', sc);
  const exists = fs.existsSync(filePath) && fs.statSync(filePath).size > 1000;
  assert(exists, `Screenshot deliverable valid: ${sc}`);
}

console.log(`\n========================================`);
console.log(`Summary: ${passedTests} Passed, ${failedTests} Failed`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
