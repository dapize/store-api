import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '@app';
import { ProductRepository } from '../product.repository';
import { ProductService } from '../product.service';

describe('Product Routes', () => {
  it('Should create a product When a valid request is sent', async () => {
    const response = await request(app).post('/products').send({ name: 'Chocolate', stock: 10 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('Chocolate');
    expect(response.body.data.stock).toBe(10);
  });

  it('Should return all products When requested', async () => {
    await ProductRepository.save(ProductRepository.create({ name: 'Gaseosa', stock: 5 }));
    await ProductRepository.save(ProductRepository.create({ name: 'Galletas', stock: 15 }));

    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('Should update product stock When given a valid product ID', async () => {
    const product = await ProductRepository.save(ProductRepository.create({ name: 'Papas', stock: 8 }));

    const response = await request(app).put(`/products/${product.id}`).send({ stock: 20 });

    expect(response.status).toBe(200);
    expect(response.body.data.stock).toBe(28);
  });

  it('Should return 404 When updating stock of a non-existent product', async () => {
    const response = await request(app).put('/products/123e4567-e89b-12d3-a456-426614174000').send({ stock: 10 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Producto no actualizado');
  });

  it('Should return 409 When trying to create a duplicate product', async () => {
    await ProductRepository.save(ProductRepository.create({ name: 'Cereal', stock: 12 }));

    const response = await request(app).post('/products').send({ name: 'Cereal', stock: 12 });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('El producto ya existe');
  });

  it('Should return 500 if createProduct throws an error', async () => {
    vi.spyOn(ProductService.prototype, 'createProduct').mockRejectedValueOnce(new Error('DB error creating product'));

    const response = await request(app).post('/products').send({
      name: 'BrokenProduct',
      stock: 10
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error creando un producto');
  });

  it('Should return 500 if updateStockProduct throws an error', async () => {
    const fakeProductId = 'f6a3596f-dfd1-4a49-a10f-310564d36953';

    vi.spyOn(ProductService.prototype, 'updateStockProduct').mockRejectedValueOnce(new Error('DB fail updating stock'));

    const response = await request(app).put(`/products/${fakeProductId}`).send({ stock: 99 });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error actualizando el producto');
  });

  it('Should return 500 if getAllProducts throws an error', async () => {
    vi.spyOn(ProductService.prototype, 'getAllProducts').mockRejectedValueOnce(new Error('DB fail in getAllProducts'));

    const response = await request(app).get('/products');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error obteniendo los productos');
  });

  it('Should return 400 if the product data is invalid', async () => {
    const response = await request(app).post('/products').send({
      name: 'ab'
    });

    expect(response.status).toBe(400);
  });

  it('Should return 400 if the update data is invalid', async () => {
    const response = await request(app).put('/products/not-a-valid-uuid').send({
      stock: 'not-a-number'
    });

    expect(response.status).toBe(400);
  });
});
