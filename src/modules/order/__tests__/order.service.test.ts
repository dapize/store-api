import { describe, expect, it } from 'vitest';
import { OrderService } from '../order.service';
import { ProductRepository } from '@modules/product';
import { UserRepository } from '@modules/user';
import { randomUUID } from 'crypto';

describe('Order Service', () => {
  const orderService = new OrderService();

  it('Should create an order when valid data is provided', async () => {
    const user = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));
    const product = await ProductRepository.save(
      ProductRepository.create({
        name: `Test Product ${randomUUID()}`,
        stock: 10
      })
    );

    const order = await orderService.createOrder(user.id, [
      {
        productId: product.id,
        quantity: 2
      }
    ]);

    expect(order).toHaveProperty('orderId');
    expect(order).toHaveProperty('userId', user.id);
    expect(order.items.length).toBe(1);
    expect(order.items[0]).toHaveProperty('itemId');
    expect(order.items[0]).toHaveProperty('productId', product.id);
    expect(order.items[0]).toHaveProperty('productName', product.name);
    expect(order.items[0]).toHaveProperty('quantity', 2);
  });

  it('Should return an error when trying to order a product with insufficient stock', async () => {
    const user = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));
    const productName = `Test Product ${randomUUID()}`;
    const product = await ProductRepository.save(
      ProductRepository.create({
        name: productName,
        stock: 1
      })
    );

    await expect(
      orderService.createOrder(user.id, [
        {
          productId: product.id,
          quantity: 10
        }
      ])
    ).rejects.toThrow(`Stock insuficiente para el producto ${productName}`);
  });

  it('Should return an error when trying to order a non-existent product', async () => {
    const user = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));

    await expect(
      orderService.createOrder(user.id, [
        {
          productId: 'non-existent-id',
          quantity: 1
        }
      ])
    ).rejects.toThrow('Producto con id non-existent-id no encontrado');
  });

  it('Should return orders filtered by userId when a userId is provided', async () => {
    const user1 = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));
    const user2 = await UserRepository.save(UserRepository.create({ nickname: `testUser_${randomUUID()}` }));

    const product = await ProductRepository.save(
      ProductRepository.create({
        name: `Test Product ${randomUUID()}`,
        stock: 10
      })
    );

    await orderService.createOrder(user1.id, [
      {
        productId: product.id,
        quantity: 2
      }
    ]);
    await orderService.createOrder(user2.id, [
      {
        productId: product.id,
        quantity: 1
      }
    ]);

    const ordersForUser1 = await orderService.getAllOrders(user1.id);

    expect(ordersForUser1.length).toBeGreaterThanOrEqual(1);
    expect(ordersForUser1.every((order) => order.user.id === user1.id)).toBe(true);
  });
});
