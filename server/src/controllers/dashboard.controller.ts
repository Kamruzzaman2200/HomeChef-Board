import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  static async getSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await DashboardService.getSummary();
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }
}
