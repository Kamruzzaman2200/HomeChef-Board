import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes for browsing
router.get('/', MenuController.getAll);
router.get('/:id', MenuController.getById);

// Kitchen chef administration routes
router.post('/', requireAdmin, MenuController.create);
router.put('/:id', requireAdmin, MenuController.update);
router.patch('/:id', requireAdmin, MenuController.update);
router.patch('/:id/toggle', requireAdmin, MenuController.toggle);
router.delete('/:id', requireAdmin, MenuController.delete);

export default router;
