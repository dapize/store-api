import { NextFunction, Request, Response } from 'express';
import { userNicknameSchema } from './user.schema';

export const validUserNickName = (request: Request, response: Response, next: NextFunction) => {
  try {
    const nickname = request.body?.nickname;
    userNicknameSchema.parse({
      nickname
    });
    next();
  } catch (error) {
    response.status(400).json(error);
  }
};
