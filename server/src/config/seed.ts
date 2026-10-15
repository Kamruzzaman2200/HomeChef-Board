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
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
      available: true,
    },
    {
      name: 'Braised Beef Short Ribs',
      description: 'Tender 12-hour braised grass-fed beef short ribs with rosemary red wine reduction and garlic potato purée.',
      category: 'Mains',
      price: 26.00,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      available: true,
    },
    {
      name: 'Wild Mushroom & Truffle Lasagna',
      description: 'Hand-rolled pasta sheets layered with chanterelles, porcini, rich béchamel, and fresh thyme.',
      category: 'Mains',
      price: 21.50,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      available: true,
    },
    {
      name: 'Lemon Rosemary Roasted Chicken',
      description: 'Half farm-raised spatchcock chicken infused with organic lemons, garlic cloves, and garden herbs.',
      category: 'Mains',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=600&q=80',
      available: true,
    },
    {
      name: 'Burrata & Heirloom Tomato Tart',
      description: 'Flaky buttery puff pastry loaded with creamy Puglia burrata, balsamic glaze, and fresh basil pesto.',
      category: 'Starters',
      price: 14.00,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
      available: true,
    },
    {
      name: 'Basque Burnt Cheesecake',
      description: 'Caramelized crust on top with a molten, velvety custard center. Baked fresh daily.',
      category: 'Desserts',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
      available: true,
    },
    {
      name: 'Weekend Feast Family Pack',
      description: 'Feeds 4-5. Includes whole roasted chicken, sourdough boule, truffle potato gratin, and Basque cheesecake.',
      category: 'Family Packs',
      price: 78.00,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
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
