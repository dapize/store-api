import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

export class ProductService {
  async createProduct(name: string, stock: number): Promise<Product> {
    const product = ProductRepository.create({ name, stock });
    return await ProductRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return await ProductRepository.find();
  }

  async getProductByName(name: string): Promise<Product | null> {
    return await ProductRepository.findOneBy({ name });
  }

  async updateStockProduct(id: string, delta: number): Promise<Product | null> {
    const product = await ProductRepository.findOneBy({ id });
    if (!product) return null;

    product.stock += delta;
    return await ProductRepository.save(product);
  }
}
