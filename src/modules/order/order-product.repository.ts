import { AppDataSource } from '@config/database';
import { OrderProduct } from './order-product.entity';

export const OrderProductRepository = AppDataSource.getRepository(OrderProduct);
