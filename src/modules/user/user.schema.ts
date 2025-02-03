import { z } from 'zod';

export const userNicknameSchema = z.object({
  nickname: z.string().min(3)
});
