import { z } from 'zod';

export const productValidSchema = z.object({
  name: z.string().min(3),
  stock: z.number().optional()
});

export const productUpdateSchema = z.object({
  id: z.string().uuid(),
  stock: z.number()
});
