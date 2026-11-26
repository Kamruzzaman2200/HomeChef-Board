import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

async function main() {
  console.log('🌱 Seeding HomeChef Board database on Neon PostgreSQL...');

  // 1. Seed Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('password123', salt);
  const customerPasswordHash = await bcrypt.hash('password123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'chef@homechef.local' },
    update: {},
    create: {
      name: 'Chef Sarah Jenkins',
      email: 'chef@homechef.local',
      phone: '+1 (555) 234-8901',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'david.miller@gmail.com' },
    update: {},
    create: {
      name: 'David Miller',
      email: 'david.miller@gmail.com',
      phone: '+1 (555) 876-5432',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
    },
  });

  console.log(`👤 Created Users: ${admin.email} (ADMIN), ${customer.email} (CUSTOMER)`);

  // 2. Seed Menu Items
  const menuData = [
    {
      name: 'Artisan Sourdough Boule',
      description: 'Slow-fermented for 36 hours with wild yeast, crispy caramelized crust and open tender crumb.',
      category: 'Bakery',
      price: 450.00,
      image: '/images/sourdough.jpg',
      available: true,
    },
    {
      name: 'Braised Beef Short Ribs',
      description: 'Tender 12-hour braised grass-fed beef short ribs with rosemary red wine reduction and garlic potato purée.',
      category: 'Mains',
      price: 1450.00,
      image: '/images/short-ribs.jpg',
      available: true,
    },
    {
      name: 'Wild Mushroom & Truffle Lasagna',
      description: 'Hand-rolled pasta sheets layered with chanterelles, porcini, rich béchamel, and fresh thyme.',
      category: 'Mains',
      price: 950.00,
      image: '/images/lasagna.jpg',
      available: true,
    },
    {
      name: 'Lemon Rosemary Roasted Chicken',
      description: 'Half farm-raised spatchcock chicken infused with organic lemons, garlic cloves, and garden herbs.',
      category: 'Mains',
      price: 1150.00,
      image: '/images/roasted-chicken.jpg',
      available: true,
    },
    {
      name: 'Burrata & Heirloom Tomato Tart',
      description: 'Flaky buttery puff pastry loaded with creamy Puglia burrata, balsamic glaze, and fresh basil pesto.',
      category: 'Starters',
      price: 650.00,
      image: '/images/burrata-tart.jpg',
      available: true,
    },
    {
      name: 'Basque Burnt Cheesecake',
      description: 'Caramelized crust on top with a molten, velvety custard center. Baked fresh daily.',
      category: 'Desserts',
      price: 450.00,
      image: '/images/cheesecake.jpg',
      available: true,
    },
    {
      name: 'Weekend Feast Family Pack',
      description: 'Feeds 4-5. Includes whole roasted chicken, sourdough boule, truffle potato gratin, and Basque cheesecake.',
      category: 'Family Packs',
      price: 3850.00,
      image: '/images/family-pack.jpg',
      available: true,
    },
  ];

  for (const item of menuData) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }

  console.log('🥖 Seeded menu items successfully!');
  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
