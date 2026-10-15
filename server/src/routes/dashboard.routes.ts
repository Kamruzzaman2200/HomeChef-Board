import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/summary', requireAdmin, DashboardController.getSummary);

export default router;
