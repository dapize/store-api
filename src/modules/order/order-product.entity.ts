import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE'
  })
  order: Order;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
