const orderSchemas = {
  Order: {
    type: 'object',
    properties: {
      orderId: {
        type: 'string',
        format: 'uuid',
        description: 'Identificador único de la orden',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      userId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario que realizó la orden',
        example: '321e4567-e89b-12d3-a456-426614174999'
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            itemId: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del item dentro de la orden',
              example: '456e7890-b123-c456-d789-987654321000'
            },
            productId: {
              type: 'string',
              format: 'uuid',
              description: 'ID del producto',
              example: 'product-1'
            },
            productName: {
              type: 'string',
              description: 'Nombre del producto',
              example: 'Chocolate'
            },
            quantity: {
              type: 'integer',
              description: 'Cantidad del producto en la orden',
              example: 2
            }
          }
        }
      }
    }
  },
  CreateOrderRequest: {
    type: 'object',
    required: ['userId', 'items'],
    properties: {
      userId: {
        type: 'string',
        format: 'uuid',
        description: 'ID del usuario que realiza la orden',
        example: '321e4567-e89b-12d3-a456-426614174999'
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: {
              type: 'string',
              format: 'uuid',
              description: 'ID del producto a ordenar',
              example: 'product-1'
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              description: 'Cantidad del producto',
              example: 2
            }
          }
        }
      }
    }
  }
};

const orderDocs = {
  paths: {
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Obtener todas las órdenes',
        description: 'Obtiene una lista de todas las órdenes registradas.',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            description: 'Filtrar órdenes por ID de usuario',
            required: false,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Lista de órdenes obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Error de validación en la consulta'
          },
          500: {
            description: 'Error interno del servidor'
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Crear una nueva orden',
        description: 'Registra una nueva orden con los productos especificados.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderRequest' }
            }
          }
        },
        responses: {
          201: {
            description: 'Orden creada correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Order' }
              }
            }
          },
          400: {
            description: 'Error de validación en los datos enviados'
          },
          404: {
            description: 'Producto no encontrado'
          },
          409: {
            description: 'Stock insuficiente para el producto solicitado'
          },
          500: {
            description: 'Error interno del servidor'
          }
        }
      }
    },
    '/orders/{orderId}': {
      delete: {
        tags: ['Orders'],
        summary: 'Eliminar una orden',
        description: 'Elimina una orden específica por su ID.',
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            description: 'ID de la orden',
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Orden eliminada correctamente'
          },
          400: {
            description: 'El ID de la orden no es válido'
          },
          404: {
            description: 'Orden no encontrada'
          },
          500: {
            description: 'Error interno del servidor'
          }
        }
      }
    }
  },
  components: {
    schemas: orderSchemas
  }
};

export default orderDocs;
