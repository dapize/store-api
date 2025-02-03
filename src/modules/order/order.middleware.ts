import { NextFunction, Request, Response } from 'express';
import { orderSchema, uuidSchema } from './order.schema';
import { INewOrder } from './order.controller';

export const validUserId = (request: Request, response: Response, next: NextFunction) => {
  const userId = (request.query as { userId: string })?.userId;
  if (!userId) {
    return next();
  }
  try {
    uuidSchema.parse(userId);
    next();
  } catch (error) {
    response.status(400).send(error);
  }
};

export const validOrder = (request: Request, response: Response, next: NextFunction) => {
  const orderData = request.body as INewOrder;
  try {
    orderSchema.parse(orderData);
    next();
  } catch (error) {
    response.status(400).send(error);
  }
};

export const validOrderId = (request: Request<{ orderId: string }>, response: Response, next: NextFunction) => {
  const orderId = request.params?.orderId;
  try {
    uuidSchema.parse(orderId);
    next();
  } catch (error) {
    response.status(400).json({
      message: 'El ID de la orden no es válido',
      error
    });
  }
};
