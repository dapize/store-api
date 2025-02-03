const productSchemas = {
  Product: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Identificador único del producto',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      name: {
        type: 'string',
        description: 'Nombre del producto',
        example: 'Chocolate'
      },
      stock: {
        type: 'integer',
        description: 'Cantidad disponible en stock',
        example: 10
      }
    }
  },
  CreateProductRequest: {
    type: 'object',
    required: ['name', 'stock'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre del producto',
        example: 'Gaseosa'
      },
      stock: {
        type: 'integer',
        description: 'Cantidad inicial en stock',
        example: 20
      }
    }
  },
  UpdateStockRequest: {
    type: 'object',
    required: ['stock'],
    properties: {
      stock: {
        type: 'integer',
        description: 'Nueva cantidad en stock',
        example: 15
      }
    }
  }
};

const productDocs = {
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Obtener todos los productos',
        description: 'Lista todos los productos disponibles en la tienda.',
        responses: {
          200: {
            description: 'Lista de productos obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' }
                    }
                  }
                }
              }
            }
          },
          500: { description: 'Error interno del servidor' }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Crear un nuevo producto',
        description: 'Registra un nuevo producto en la tienda con una cantidad inicial en stock.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Producto creado correctamente' },
          400: { description: 'Solicitud incorrecta' },
          409: { description: 'El producto ya existe' },
          500: { description: 'Error interno del servidor' }
        }
      }
    },
    '/products/{uuid}': {
      put: {
        tags: ['Products'],
        summary: 'Actualizar stock de un producto',
        description: 'Permite modificar la cantidad disponible en stock de un producto existente.',
        parameters: [
          {
            name: 'uuid',
            in: 'path',
            required: true,
            description: 'ID del producto a actualizar',
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStockRequest' }
            }
          }
        },
        responses: {
          200: {
            description: 'Stock actualizado correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Product' }
                  }
                }
              }
            }
          },
          404: { description: 'Producto no encontrado' },
          500: { description: 'Error interno del servidor' }
        }
      }
    }
  },
  components: {
    schemas: productSchemas
  }
};

export default productDocs;
