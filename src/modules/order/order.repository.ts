import { AppDataSource } from '@config/database';
import { Order } from './order.entity';

export const OrderRepository = AppDataSource.getRepository(Order);
