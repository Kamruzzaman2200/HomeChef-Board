import prisma from '../config/prisma.js';
import { CreateOrderInput } from '../validators/order.validator.js';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  /**
   * Calculates order totals on the server and inserts the order + order items
   * inside a database transaction to ensure transactional consistency and historical accuracy.
   */
  static async createOrder(userId: string, input: CreateOrderInput) {
    // 1. Fetch referenced menu items from DB to calculate prices server-side
    const menuItemIds = input.items.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (dbMenuItems.length !== input.items.length) {
      throw new Error('One or more selected menu items could not be found');
    }

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
        itemNameSnapshot: dbItem.name, // Preserved snapshot
        quantity: item.quantity,
        unitPrice: dbItem.price,
      };
    });

    // Packaging / eco-box fee
    total += 1.50;

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

  static async getOrders(params?: {
    userId?: string;
    status?: OrderStatus;
    date?: string;
    search?: string;
  }) {
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

    return prisma.order.findMany({
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
  }

  static async getById(id: string) {
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

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  static async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
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
}
