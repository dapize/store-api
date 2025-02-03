import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '@app';
import { OrderRepository } from '../order.repository';
import { ProductRepository } from '@modules/product';
import { UserRepository } from '@modules/user';
import { OrderProductRepository } from '../order-product.repository';
import { randomUUID } from 'crypto';

describe('Order Routes', () => {
  it('Should create an order when a valid request is sent', async () => {
    const user = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));
    const product = await ProductRepository.save(
      ProductRepository.create({
        name: `Test Product ${randomUUID()}`,
        stock: 10
      })
    );

    const response = await request(app)
      .post('/orders')
      .send({
        userId: user.id,
        items: [{ productId: product.id, quantity: 2 }]
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('orderId');
    expect(response.body).toHaveProperty('userId');
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0]).toHaveProperty('itemId');
    expect(response.body.items[0]).toHaveProperty('productId', product.id);
    expect(response.body.items[0]).toHaveProperty('productName', product.name);
    expect(response.body.items[0]).toHaveProperty('quantity', 2);
  });

  it('Should return all orders when a request is made', async () => {
    const response = await request(app).get('/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('Should return 404 when deleting a non-existent order', async () => {
    const response = await request(app).delete('/orders/123e4567-e89b-12d3-a456-426614174000');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Orden con ID 123e4567-e89b-12d3-a456-426614174000 no encontrada');
  });

  it('Should delete an order when a valid order ID is provided', async () => {
    const user = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));
    const product = await ProductRepository.save(
      ProductRepository.create({
        name: `Test Product ${randomUUID()}`,
        stock: 10
      })
    );

    const order = await OrderRepository.save(OrderRepository.create({ user }));

    await OrderProductRepository.save(OrderProductRepository.create({ order, product, quantity: 2 }));

    const response = await request(app).delete(`/orders/${order.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Orden con ID ${order.id} eliminada correctamente`);

    const deletedOrder = await OrderRepository.findOneBy({ id: order.id });
    expect(deletedOrder).toBeNull();
  });

  it('Should return 400 when userId query param is invalid', async () => {
    const response = await request(app).get('/orders?userId=invalid-uuid');

    expect(response.status).toBe(400);
  });

  it('Should return 400 when creating an order with invalid data', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        userId: 'invalid-uuid',
        items: [{ productId: 'invalid-uuid', quantity: 'invalid-number' }]
      });

    expect(response.status).toBe(400);
  });

  it('Should return 400 when deleting an order with an invalid ID', async () => {
    const response = await request(app).delete('/orders/invalid-uuid');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('El ID de la orden no es válido');
  });
});
