import { NextFunction, Request, Response } from 'express';
import { productUpdateSchema, productValidSchema } from './product.schema';

export const validProduct = (request: Request, response: Response, next: NextFunction) => {
  try {
    const name = request.body?.name as string;
    const stock = request.body?.stock as number;
    productValidSchema.parse({
      name,
      stock
    });
    next();
  } catch (error) {
    response.status(400).json(error);
  }
};

export const validUpdateProduct = (request: Request, response: Response, next: NextFunction) => {
  const uuid = request.params?.uuid as string;
  const stock = request.body?.stock as number;
  try {
    productUpdateSchema.parse({
      id: uuid,
      stock
    });
    next();
  } catch (error) {
    response.status(400).send(error);
  }
};
