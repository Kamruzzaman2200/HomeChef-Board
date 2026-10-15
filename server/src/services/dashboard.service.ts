import prisma from '../config/prisma.js';

export class DashboardService {
  static async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [orders, statusGroups] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: today },
        },
        select: {
          status: true,
          total: true,
        },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      }),
    ]);

    const countMap: Record<string, number> = {
      REQUESTED: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    statusGroups.forEach((g) => {
      countMap[g.status] = g._count.id;
    });

    const todayRevenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.total), 0);

    const totalOrdersCount = await prisma.order.count();

    return {
      requestedCount: countMap.REQUESTED,
      confirmedCount: countMap.CONFIRMED,
      preparingCount: countMap.PREPARING,
      readyCount: countMap.READY,
      completedCount: countMap.COMPLETED,
      todayRevenue,
      totalOrdersCount,
    };
  }
}
