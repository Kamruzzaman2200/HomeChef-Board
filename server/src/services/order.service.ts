import prisma from '../config/prisma.js';
import { CreateOrderInput } from '../validators/order.validator.js';
import { OrderStatus } from '@prisma/client';
import { fallbackMenuItems } from './menu.service.js';

export const fallbackOrders: any[] = [
  {
    id: 'ORD-7821',
    userId: 'u-cust-01',
    orderDate: new Date(Date.now() - 2 * 3600 * 1000),
    fulfillDate: new Date(),
    fulfillTime: '12:30 PM',
    fulfillType: 'PICKUP',
    addressNote: 'Silver Toyota RAV4, parking bay #2',
    notes: 'Please pack the sourdough in a paper bakery bag.',
    status: 'PREPARING' as OrderStatus,
    total: 2400.00,
    feedbackRating: null,
    feedbackNote: null,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(),
    items: [
      {
        id: 'oi-101',
        orderId: 'ORD-7821',
        menuItemId: 'm-02',
        itemNameSnapshot: 'Braised Beef Short Ribs',
        quantity: 1,
        unitPrice: 1450.00,
        menuItem: fallbackMenuItems.find((m) => m.id === 'm-02'),
      },
      {
        id: 'oi-102',
        orderId: 'ORD-7821',
        menuItemId: 'm-01',
        itemNameSnapshot: 'Artisan Sourdough Boule',
        quantity: 2,
        unitPrice: 450.00,
        menuItem: fallbackMenuItems.find((m) => m.id === 'm-01'),
      },
    ],
    user: {
      id: 'u-cust-01',
      name: 'David Miller',
      email: 'david.miller@gmail.com',
      phone: '+1 (555) 876-5432',
    },
  },
  {
    id: 'ORD-7822',
    userId: 'u-cust-02',
    orderDate: new Date(Date.now() - 3600 * 1000),
    fulfillDate: new Date(),
    fulfillTime: '01:00 PM',
    fulfillType: 'DELIVERY',
    addressNote: 'Apartment 4B, buzzer code 1245',
    notes: 'Extra balsamic reduction on the side.',
    status: 'CONFIRMED' as OrderStatus,
    total: 1450.00,
    feedbackRating: null,
    feedbackNote: null,
    createdAt: new Date(Date.now() - 3600 * 1000),
    updatedAt: new Date(),
    items: [
      {
        id: 'oi-103',
        orderId: 'ORD-7822',
        menuItemId: 'm-03',
        itemNameSnapshot: 'Wild Mushroom & Truffle Lasagna',
        quantity: 1,
        unitPrice: 950.00,
        menuItem: fallbackMenuItems.find((m) => m.id === 'm-03'),
      },
      {
        id: 'oi-104',
        orderId: 'ORD-7822',
        menuItemId: 'm-06',
        itemNameSnapshot: 'Basque Burnt Cheesecake',
        quantity: 1,
        unitPrice: 450.00,
        menuItem: fallbackMenuItems.find((m) => m.id === 'm-06'),
      },
    ],
    user: {
      id: 'u-cust-02',
      name: 'Elena Rostova',
      email: 'elena.rostova@outlook.com',
      phone: '+1 (555) 345-6789',
    },
  },
  {
    id: 'ORD-7823',
    userId: 'u-cust-01',
    orderDate: new Date(Date.now() - 24 * 3600 * 1000),
    fulfillDate: new Date(Date.now() - 24 * 3600 * 1000),
    fulfillTime: '06:30 PM',
    fulfillType: 'PICKUP',
    addressNote: 'Picked up at kitchen gate',
    notes: 'Family celebration feast pack.',
    status: 'COMPLETED' as OrderStatus,
    total: 3900.00,
    feedbackRating: 5,
    feedbackNote: 'Incredible sourdough and dessert! Best home kitchen in town.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    updatedAt: new Date(),
    items: [
      {
        id: 'oi-105',
        orderId: 'ORD-7823',
        menuItemId: 'm-07',
        itemNameSnapshot: 'Weekend Feast Family Pack',
        quantity: 1,
        unitPrice: 3850.00,
        menuItem: fallbackMenuItems.find((m) => m.id === 'm-07'),
      },
    ],
    user: {
      id: 'u-cust-01',
      name: 'David Miller',
      email: 'david.miller@gmail.com',
      phone: '+1 (555) 876-5432',
    },
  },
];

export class OrderService {
  /**
   * Calculates order totals on the server and inserts the order + order items.
   * Uses Prisma transaction when connected to database, with full in-memory fallback.
   */
  static async createOrder(userId: string, input: CreateOrderInput) {
    try {
      // 1. Fetch referenced menu items from DB to calculate prices server-side
      const menuItemIds = input.items.map((i) => i.menuItemId);
      const dbMenuItems = await prisma.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      if (dbMenuItems.length === input.items.length) {
        const itemMap = new Map(dbMenuItems.map((m) => [m.id, m]));

        // 2. Calculate server-side total and prepare snapshots
        let total = 0;
        const itemsData = input.items.map((item) => {
          const dbItem = itemMap.get(item.menuItemId)!;
          if (!dbItem.available || dbItem.isArchived) {
            throw new Error(`Item "${dbItem.name}" is currently sold out or unavailable`);
          }

          const unitPrice = Number(dbItem.price);
          const subtotal = unitPrice * item.quantity;
          total += subtotal;

          return {
            menuItemId: dbItem.id,
            itemNameSnapshot: dbItem.name,
            quantity: item.quantity,
            unitPrice: dbItem.price,
          };
        });

        // Packaging fee (BDT 50)
        total += 50.00;

        // 3. Insert inside database transaction
        const newOrder = await prisma.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              userId,
              fulfillDate: input.fulfillDate ? new Date(input.fulfillDate) : new Date(),
              fulfillTime: input.fulfillTime,
              fulfillType: input.fulfillType,
              addressNote: input.addressNote,
              notes: input.notes,
              status: 'REQUESTED',
              total,
              items: {
                create: itemsData,
              },
            },
            include: {
              items: {
                include: { menuItem: true },
              },
              user: {
                select: { id: true, name: true, email: true, phone: true },
              },
            },
          });

          return order;
        });

        return newOrder;
      }
    } catch (dbErr: any) {
      if (dbErr.message?.includes('sold out')) throw dbErr;
      console.warn('⚠️ Neon PostgreSQL connection unavailable during createOrder, using in-memory fallback:', dbErr.message);
    }

    // In-memory fallback calculation when Neon DB connection is offline
    const itemMap = new Map<string, any>();
    for (const item of input.items) {
      const normalizedId = item.menuItemId.replace(/^m-(\d)$/, 'm-0$1');
      const found = fallbackMenuItems.find(
        (m) => m.id === item.menuItemId || m.id === normalizedId || m.name.toLowerCase() === item.menuItemId.toLowerCase()
      );
      if (!found) {
        throw new Error('One or more selected menu items could not be found');
      }
      if (!found.available || found.isArchived) {
        throw new Error(`Item "${found.name}" is currently sold out or unavailable`);
      }
      itemMap.set(item.menuItemId, found);
    }

    let total = 0;
    const itemsData = input.items.map((item, idx) => {
      const dbItem = itemMap.get(item.menuItemId)!;
      const unitPrice = Number(dbItem.price);
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      return {
        id: `oi-${Date.now()}-${idx}`,
        menuItemId: dbItem.id,
        itemNameSnapshot: dbItem.name,
        quantity: item.quantity,
        unitPrice: dbItem.price,
        menuItem: dbItem,
      };
    });

    total += 50.00; // Packaging fee (BDT 50)

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      orderDate: new Date(),
      fulfillDate: input.fulfillDate ? new Date(input.fulfillDate) : new Date(),
      fulfillTime: input.fulfillTime,
      fulfillType: input.fulfillType,
      addressNote: input.addressNote,
      notes: input.notes,
      status: 'REQUESTED' as OrderStatus,
      total,
      feedbackRating: null,
      feedbackNote: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: itemsData,
      user: {
        id: userId,
        name: userId === 'u-chef-01' ? 'Chef Sarah Jenkins' : userId === 'u-cust-02' ? 'Elena Rostova' : 'David Miller',
        email: userId === 'u-chef-01' ? 'chef@homechef.local' : userId === 'u-cust-02' ? 'elena.rostova@outlook.com' : 'david.miller@gmail.com',
        phone: '+1 (555) 876-5432',
      },
    };

    fallbackOrders.unshift(newOrder);
    return newOrder;
  }

  static async getOrders(params?: {
    userId?: string;
    status?: OrderStatus;
    date?: string;
    search?: string;
  }) {
    try {
      const where: any = {};

      if (params?.userId) {
        where.userId = params.userId;
      }

      if (params?.status) {
        where.status = params.status;
      }

      if (params?.date) {
        const start = new Date(params.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(params.date);
        end.setHours(23, 59, 59, 999);
        where.fulfillDate = { gte: start, lte: end };
      }

      if (params?.search) {
        where.OR = [
          { id: { contains: params.search, mode: 'insensitive' } },
          { user: { name: { contains: params.search, mode: 'insensitive' } } },
        ];
      }

      return await prisma.order.findMany({
        where,
        include: {
          items: {
            include: { menuItem: true },
          },
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('⚠️ Neon PostgreSQL connection unavailable during getOrders, using in-memory fallback:', (dbErr as Error).message);
    }

    let result = [...fallbackOrders];
    if (params?.userId) {
      result = result.filter((o) => o.userId === params.userId);
    }
    if (params?.status) {
      result = result.filter((o) => o.status === params.status);
    }
    if (params?.date) {
      const targetDate = new Date(params.date).toISOString().slice(0, 10);
      result = result.filter((o) => {
        const fDate = new Date(o.fulfillDate).toISOString().slice(0, 10);
        return fDate === targetDate;
      });
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter((o) =>
        o.id.toLowerCase().includes(q) || (o.user?.name || '').toLowerCase().includes(q)
      );
    }
    return result;
  }

  static async getById(id: string) {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: { menuItem: true },
          },
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
      });

      if (order) return order;
    } catch (dbErr) {
      console.warn('⚠️ Neon PostgreSQL connection unavailable during getById, using in-memory fallback:', (dbErr as Error).message);
    }

    const order = fallbackOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  static async updateStatus(id: string, status: OrderStatus) {
    try {
      const existing = await prisma.order.findUnique({
        where: { id },
        select: { id: true, status: true },
      });

      if (existing) {
        if (existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
          if (existing.status !== status) {
            throw new Error(
              `Cannot change status of an order that is already ${existing.status}. Completed and cancelled orders are immutable.`
            );
          }
        }

        return await prisma.order.update({
          where: { id },
          data: { status },
          include: {
            items: {
              include: { menuItem: true },
            },
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        });
      }
    } catch (dbErr: any) {
      if (dbErr.message?.includes('Cannot change status of an order')) throw dbErr;
      console.warn('⚠️ Neon PostgreSQL connection unavailable during updateStatus, using in-memory fallback:', dbErr.message);
    }

    const order = fallbackOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED') {
      if (order.status !== status) {
        throw new Error(
          `Cannot change status of an order that is already ${order.status}. Completed and cancelled orders are immutable.`
        );
      }
    }

    order.status = status;
    order.updatedAt = new Date();
    return order;
  }

  static async updateNotes(id: string, notes: string) {
    try {
      const existing = await prisma.order.findUnique({ where: { id } });
      if (existing) {
        return await prisma.order.update({
          where: { id },
          data: { notes },
          include: {
            items: {
              include: { menuItem: true },
            },
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ Neon PostgreSQL connection unavailable during updateNotes, using in-memory fallback:', (dbErr as Error).message);
    }

    const order = fallbackOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.notes = notes;
    order.updatedAt = new Date();
    return order;
  }

  static async submitFeedback(id: string, userId: string, rating: number, note?: string) {
    try {
      const order = await prisma.order.findUnique({ where: { id } });
      if (order) {
        if (order.userId !== userId) {
          throw new Error('You can only submit feedback for your own orders');
        }

        if (order.status !== 'COMPLETED') {
          throw new Error('Feedback can only be submitted once the order has been completed');
        }

        return await prisma.order.update({
          where: { id },
          data: {
            feedbackRating: rating,
            feedbackNote: note || null,
          },
          include: {
            items: {
              include: { menuItem: true },
            },
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        });
      }
    } catch (dbErr: any) {
      if (dbErr.message?.includes('feedback') || dbErr.message?.includes('orders')) throw dbErr;
      console.warn('⚠️ Neon PostgreSQL connection unavailable during submitFeedback, using in-memory fallback:', dbErr.message);
    }

    const order = fallbackOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('You can only submit feedback for your own orders');
    }

    if (order.status !== 'COMPLETED') {
      throw new Error('Feedback can only be submitted once the order has been completed');
    }

    order.feedbackRating = rating;
    order.feedbackNote = note || null;
    order.updatedAt = new Date();
    return order;
  }
}
