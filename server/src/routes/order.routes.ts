import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Order creation & customer history
router.post('/', requireAuth, OrderController.create);
router.get('/my-orders', requireAuth, OrderController.getMyOrders);

// Kitchen board / admin queries
router.get('/', requireAuth, OrderController.getAll);
router.get('/:id', requireAuth, OrderController.getById);
router.patch('/:id/status', requireAuth, OrderController.updateStatus);
router.patch('/:id/notes', requireAuth, OrderController.updateNotes);
router.patch('/:id/feedback', requireAuth, OrderController.submitFeedback);

export default router;
