import { z } from 'zod';

export const uuidSchema = z.string().uuid();

export const orderSchema = z.object({
  userId: uuidSchema,
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number()
      })
    )
    .min(1, 'Se requiere al menos un producto en la orden')
});
