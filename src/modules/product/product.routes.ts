import { Router } from 'express';
import { getAllProducts, newProduct, updateStockProduct } from './product.controller';
import { validProduct, validUpdateProduct } from './product.middleware';

export const router = Router();

router.get('/', getAllProducts);

router.post('/', validProduct, newProduct);

router.put('/:uuid', validUpdateProduct, updateStockProduct);
