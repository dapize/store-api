import { describe, expect, it } from 'vitest';
import { ProductService } from '../product.service';

describe('Product Service', () => {
  const productService = new ProductService();

  it('Should create a product When valid data is provided', async () => {
    const product = await productService.createProduct('Juice', 5);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Juice');
    expect(product.stock).toBe(5);
  });

  it('Should return all products When requested', async () => {
    await productService.createProduct('Milk', 8);
    const products = await productService.getAllProducts();
    expect(products.length).toBeGreaterThanOrEqual(1);
  });
});
