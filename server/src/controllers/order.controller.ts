import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';
import { OrderStatus } from '@prisma/client';

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createOrderSchema.parse(req.body);
      const userId = req.session?.user?.id || (req.headers['x-demo-user-id'] as string);

      if (!userId) {
        res.status(401).json({ error: 'You must be signed in to place an order' });
        return;
      }

      const order = await OrderService.createOrder(userId, validated);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as OrderStatus | undefined;
      const date = req.query.date as string | undefined;
      const search = req.query.search as string | undefined;
      const customerId = req.query.customerId as string | undefined;

      const orders = await OrderService.getOrders({
        userId: customerId,
        status,
        date,
        search,
      });

      res.json(orders);
    } catch (err) {
      next(err);
    }
  }

  static async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.session?.user?.id || (req.headers['x-demo-user-id'] as string);
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const orders = await OrderService.getOrders({ userId });
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderService.getById(req.params.id);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = updateOrderStatusSchema.parse(req.body);
      const updated = await OrderService.updateStatus(req.params.id, status as OrderStatus);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
}
