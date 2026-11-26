import prisma from '../config/prisma.js';
import { CreateMenuItemInput, UpdateMenuItemInput } from '../validators/menu.validator.js';

const fallbackMenuItems = [
  {
    id: 'm-01',
    name: 'Artisan Sourdough Boule',
    description: 'Slow-fermented for 36 hours with wild yeast, crispy caramelized crust and open tender crumb.',
    category: 'Bakery',
    price: 450.00,
    image: '/images/sourdough.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-02',
    name: 'Braised Beef Short Ribs',
    description: 'Tender 12-hour braised grass-fed beef short ribs with rosemary red wine reduction and garlic potato purée.',
    category: 'Mains',
    price: 1450.00,
    image: '/images/short-ribs.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-03',
    name: 'Wild Mushroom & Truffle Lasagna',
    description: 'Hand-rolled pasta sheets layered with chanterelles, porcini, rich béchamel, and fresh thyme.',
    category: 'Mains',
    price: 950.00,
    image: '/images/lasagna.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-04',
    name: 'Lemon Rosemary Roasted Chicken',
    description: 'Half farm-raised spatchcock chicken infused with organic lemons, garlic cloves, and garden herbs.',
    category: 'Mains',
    price: 1150.00,
    image: '/images/roasted-chicken.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-05',
    name: 'Burrata & Heirloom Tomato Tart',
    description: 'Flaky buttery puff pastry loaded with creamy Puglia burrata, balsamic glaze, and fresh basil pesto.',
    category: 'Starters',
    price: 650.00,
    image: '/images/burrata-tart.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-06',
    name: 'Basque Burnt Cheesecake',
    description: 'Caramelized crust on top with a molten, velvety custard center. Baked fresh daily.',
    category: 'Desserts',
    price: 450.00,
    image: '/images/cheesecake.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-07',
    name: 'Cardamom Pistachio Babka',
    description: 'Swirled enriched brioche loaf braided with freshly ground cardamom, crushed pistachios, and honey glaze.',
    category: 'Bakery',
    price: 550.00,
    image: '/images/babka.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'm-08',
    name: 'Weekend Feast Family Pack',
    description: 'Feeds 4-5. Includes whole roasted chicken, sourdough boule, truffle potato gratin, and Basque cheesecake.',
    category: 'Family Packs',
    price: 3850.00,
    image: '/images/family-pack.jpg',
    available: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class MenuService {
  static async getAll(params?: { category?: string; availableOnly?: boolean }) {
    const where: any = { isArchived: false };

    if (params?.category && params.category !== 'All') {
      where.category = params.category;
    }

    if (params?.availableOnly) {
      where.available = true;
    }

    try {
      const items = await prisma.menuItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      if (items.length > 0) return items;
    } catch {
      // Fallback to in-memory BDT dataset if Neon DB connection is unreachable
    }

    let result = fallbackMenuItems.filter((i) => !i.isArchived);
    if (params?.category && params.category !== 'All') {
      result = result.filter((i) => i.category === params.category);
    }
    if (params?.availableOnly) {
      result = result.filter((i) => i.available);
    }
    return result;
  }

  static async getById(id: string) {
    try {
      const item = await prisma.menuItem.findUnique({
        where: { id },
      });
      if (item) return item;
    } catch {
      // Fallback
    }

    const fallback = fallbackMenuItems.find((i) => i.id === id);
    if (!fallback) {
      throw new Error('Menu item not found');
    }
    return fallback;
  }

  static async create(input: CreateMenuItemInput) {
    return prisma.menuItem.create({
      data: {
        name: input.name,
        description: input.description,
        category: input.category,
        price: input.price,
        image: input.image,
        available: input.available ?? true,
      },
    });
  }

  static async update(id: string, input: UpdateMenuItemInput) {
    return prisma.menuItem.update({
      where: { id },
      data: input,
    });
  }

  static async toggleAvailability(id: string) {
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item) {
      throw new Error('Menu item not found');
    }
    return prisma.menuItem.update({
      where: { id },
      data: { available: !item.available },
    });
  }

  static async delete(id: string) {
    // Soft delete / archive to ensure foreign key safety and historical order preservation
    return prisma.menuItem.update({
      where: { id },
      data: {
        isArchived: true,
        available: false,
      },
    });
  }
}
