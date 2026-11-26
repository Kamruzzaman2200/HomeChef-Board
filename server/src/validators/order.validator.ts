import { z } from 'zod';

export const createOrderSchema = z.object({
  fulfillDate: z.string().optional(),
  fulfillTime: z.string().min(1, 'Fulfill time is required'),
  fulfillType: z.enum(['PICKUP', 'DELIVERY']).default('PICKUP'),
  addressNote: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      menuItemId: z.string().min(1, 'Menu item ID is required'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
    })
  ).min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'REQUESTED',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED',
  ]),
});

export const updateOrderNotesSchema = z.object({
  notes: z.string().default(''),
});

export const orderFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  note: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateOrderNotesInput = z.infer<typeof updateOrderNotesSchema>;
export type OrderFeedbackInput = z.infer<typeof orderFeedbackSchema>;
