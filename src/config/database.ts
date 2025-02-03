import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { OrderProduct } from '@modules/order/order-product.entity';
import { Order } from '@modules/order/order.entity';
import { Product } from '@modules/product/product.entity';
import { User } from '@modules/user/user.entity';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';
const dbName = isTest ? ':memory:' : process.env.DB_PATH || 'database.sqlite';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbName,
  entities: [OrderProduct, Order, Product, User],
  logging: isDevelopment,
  synchronize: isDevelopment || isTest
});
