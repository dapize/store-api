import { Request, Response } from 'express';
import { OrderService } from './order.service';

const orderService = new OrderService();

export interface IITem {
  productId: string;
  quantity: number;
}

export interface INewOrder {
  userId: string;
  items: IITem[];
}

export const createOrder = async (request: Request, response: Response): Promise<void> => {
  try {
    const { userId, items } = request.body as INewOrder;
    const order = await orderService.createOrder(userId, items);
    response.status(201).json(order);
  } catch (error) {
    response.status(500).json({
      message: 'Error al crear la orden',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const getOrders = async (request: Request, response: Response): Promise<void> => {
  try {
    const userId = (request.query as { userId?: string })?.userId as string;
    const orders = await orderService.getAllOrders(userId);
    response.status(200).json({
      data: orders
    });
  } catch (error) {
    response.status(500).json({
      message: 'Ocurrió un error obteniendo las órdenes',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const deleteOrder = async (request: Request, response: Response): Promise<void> => {
  try {
    const { orderId } = request.params;
    const { message, status } = await orderService.deleteOrder(orderId);
    response.status(status).json({ message });
  } catch (error) {
    response.status(500).json({
      message: 'Error al eliminar la orden',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
