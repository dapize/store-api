import { Request, Response } from 'express';
import { ProductService } from './product.service';

const productService = new ProductService();

export const newProduct = async (request: Request, response: Response) => {
  try {
    const { name, stock } = request.body as { name: string; stock: number };
    const getProduct = await productService.getProductByName(name);
    if (getProduct) {
      response.status(409).json({
        message: 'El producto ya existe'
      });
      return;
    }

    const product = await productService.createProduct(name, stock);
    response.status(200).json({ data: product });
  } catch (error) {
    response.status(500).json({
      message: 'Error creando un producto',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const getAllProducts = async (_: Request, response: Response) => {
  try {
    const products = await productService.getAllProducts();
    response.status(200).json({
      data: products
    });
  } catch (error) {
    response.status(500).json({
      message: 'Error obteniendo los productos',
      error: error instanceof Error ? error.message : error
    });
  }
};

export const updateStockProduct = async (request: Request, response: Response) => {
  const { uuid } = request.params as { uuid: string };
  const { stock } = request.body as { stock: number };
  try {
    const product = await productService.updateStockProduct(uuid, stock);
    if (!product) {
      response.status(404).json({ message: 'Producto no actualizado' });
      return;
    }
    response.status(200).json({
      data: product
    });
  } catch (error) {
    response.status(500).json({
      message: 'Error actualizando el producto',
      error: error instanceof Error ? error.message : error
    });
  }
};
