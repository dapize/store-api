import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { createOrder, getOrders, deleteOrder } from '../order.controller';
import { OrderService } from '../order.service';

vi.mock('../order.service');

describe('Order Controller', () => {
  const mockRequest = (body = {}, params = {}, query = {}) => ({ body, params, query }) as unknown as Request;

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  it('Should return 500 if createOrder fails', async () => {
    const req = mockRequest({ userId: 'fakeUserId', items: [] });
    const res = mockResponse();

    vi.spyOn(OrderService.prototype, 'createOrder').mockRejectedValue(new Error('Error en createOrder'));

    await createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al crear la orden',
      error: 'Error en createOrder'
    });
  });

  it('Should return 500 if getOrders fails', async () => {
    const req = mockRequest({}, {}, { userId: 'fakeUserId' });
    const res = mockResponse();

    vi.spyOn(OrderService.prototype, 'getAllOrders').mockRejectedValue(new Error('Error en getOrders'));

    await getOrders(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Ocurrió un error obteniendo las órdenes',
      error: 'Error en getOrders'
    });
  });

  it('Should return 500 if deleteOrder fails', async () => {
    const req = mockRequest({}, { orderId: 'fakeOrderId' });
    const res = mockResponse();

    vi.spyOn(OrderService.prototype, 'deleteOrder').mockRejectedValue(new Error('Error en deleteOrder'));

    await deleteOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al eliminar la orden',
      error: 'Error en deleteOrder'
    });
  });
});
