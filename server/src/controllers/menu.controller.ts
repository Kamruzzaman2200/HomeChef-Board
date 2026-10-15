import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service.js';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menu.validator.js';

export class MenuController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const availableOnly = req.query.available === 'true';
      const items = await MenuService.getAll({ category, availableOnly });
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const item = await MenuService.getById(req.params.id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = createMenuItemSchema.parse(req.body);
      const created = await MenuService.create(validated);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = updateMenuItemSchema.parse(req.body);
      const updated = await MenuService.update(req.params.id, validated);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await MenuService.delete(req.params.id);
      res.json({ message: 'Menu item archived successfully' });
    } catch (err) {
      next(err);
    }
  }
}
