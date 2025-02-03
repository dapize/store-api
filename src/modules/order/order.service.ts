import { FindManyOptions } from 'typeorm';
import { OrderRepository } from './order.repository';
import { ProductRepository } from '../product/product.repository';
import { Order } from './order.entity';
import { OrderProduct } from './order-product.entity';
import { OrderProductRepository } from './order-product.repository';
import { ProductService } from '../product';

const productService = new ProductService();

interface IProduct {
  productId: string;
  quantity: number;
}

interface IOrderItem {
  itemId: string;
  productId: string;
  productName: string;
  quantity: number;
}

interface IOrderResponse {
  orderId: string;
  userId: string;
  items: IOrderItem[];
}

export class OrderService {
  async createOrder(userId: string, items: IProduct[]): Promise<IOrderResponse> {
    const order = OrderRepository.create({ user: { id: userId } });

    const orderProducts: OrderProduct[] = [];

    for (const { productId, quantity } of items) {
      const product = await ProductRepository.findOneBy({ id: productId });
      if (!product) throw new Error(`Producto con id ${productId} no encontrado`);
      if (product.stock < quantity) throw new Error(`Stock insuficiente para el producto ${product.name}`);

      product.stock -= quantity;
      await ProductRepository.save(product);

      const orderProduct = OrderProductRepository.create({
        order,
        product,
        quantity
      });

      orderProducts.push(orderProduct);
    }

    const savedOrder = await OrderRepository.save(order);
    orderProducts.forEach((orderProduct) => (orderProduct.order = savedOrder));
    await OrderProductRepository.save(orderProducts);

    return {
      orderId: savedOrder.id,
      userId: savedOrder.user.id,
      items: orderProducts.map((op) => ({
        itemId: op.id,
        productId: op.product.id,
        productName: op.product.name,
        quantity: op.quantity
      }))
    };
  }

  async getAllOrders(userId?: string): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      relations: ['user', 'items', 'items.product'],
      order: { id: 'DESC' }
    };

    if (userId) {
      options.where = { user: { id: userId } };
    }

    const orders = await OrderRepository.find(options);
    for (const order of orders) {
      for (const item of order.items) {
        if (item.product) {
          const product = await ProductRepository.findOne({
            where: { id: item.product.id },
            select: ['id', 'name']
          });

          if (!product) {
            throw new Error(`Producto con id ${item.product.id} no encontrado`);
          }

          item.product = product;
        }
      }
    }

    return orders;
  }

  async deleteOrder(orderId: string): Promise<{ message: string; status: number }> {
    const order = await OrderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product']
    });

    if (!order) {
      return {
        message: `Orden con ID ${orderId} no encontrada`,
        status: 404
      };
    }

    for (const item of order.items) {
      if (item.product) {
        await productService.updateStockProduct(item.product.id, item.quantity);
      }
    }

    await OrderRepository.remove(order);
    return {
      message: `Orden con ID ${orderId} eliminada correctamente`,
      status: 200
    };
  }
}
