import { Router } from 'express';
import { validOrder, validOrderId, validUserId } from './order.middleware';
import { createOrder, deleteOrder, getOrders } from './order.controller';

export const router = Router();

router.post('/', validOrder, createOrder);
router.get('/', validUserId, getOrders);
router.delete('/:orderId', validOrderId, deleteOrder);
