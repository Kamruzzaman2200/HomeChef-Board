import prisma from '../config/prisma.js';
import { CreateMenuItemInput, UpdateMenuItemInput } from '../validators/menu.validator.js';

export class MenuService {
  static async getAll(params?: { category?: string; availableOnly?: boolean }) {
    const where: any = { isArchived: false };

    if (params?.category && params.category !== 'All') {
      where.category = params.category;
    }

    if (params?.availableOnly) {
      where.available = true;
    }

    return prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getById(id: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id },
    });
    if (!item) {
      throw new Error('Menu item not found');
    }
    return item;
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
