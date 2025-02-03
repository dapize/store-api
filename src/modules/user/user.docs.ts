const userSchemas = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Identificador único del usuario',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      nickname: {
        type: 'string',
        description: 'Nombre de usuario único',
        example: 'danielpz'
      }
    }
  },
  CreateUserRequest: {
    type: 'object',
    required: ['nickname'],
    properties: {
      nickname: {
        type: 'string',
        description: 'Nombre de usuario',
        example: 'danielpz'
      }
    }
  }
};

const userDocs = {
  paths: {
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Crear un nuevo usuario',
        description: 'Crea un usuario en la base de datos con un nickname único.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUserRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuario creado exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Error de validación (nickname incorrecto o duplicado)'
          },
          500: {
            description: 'Error interno del servidor'
          }
        }
      },
      get: {
        tags: ['Users'],
        summary: 'Obtener todos los usuarios',
        description: 'Devuelve una lista de todos los usuarios registrados en la base de datos.',
        responses: {
          200: {
            description: 'Lista de usuarios obtenida correctamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          },
          500: {
            description: 'Error interno del servidor'
          }
        }
      }
    }
  },
  components: {
    schemas: userSchemas
  }
};

export default userDocs;
