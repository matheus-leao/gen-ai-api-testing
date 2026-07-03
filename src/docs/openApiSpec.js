export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Gen AI API Testing',
    version: '1.0.0',
    description:
      'API para criação de usuários, login com JWT e geração de exercícios customizados de lógica de programação.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Verificação de disponibilidade da API'
    },
    {
      name: 'Users',
      description: 'Criação e autenticação de usuários'
    },
    {
      name: 'Exercises',
      description: 'Geração de exercícios de lógica de programação'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid or missing token'
          }
        }
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok'
          }
        }
      },
      CreateUserRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            example: 'Ana'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'secret123'
          }
        }
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '2f4df0d3-ef78-4499-8bc2-755982cd8b74'
          },
          name: {
            type: 'string',
            example: 'Ana'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@example.com'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-07-03T00:00:00.000Z'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'ana@example.com'
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'secret123'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'jwt-token'
          },
          tokenType: {
            type: 'string',
            example: 'Bearer'
          },
          expiresInSeconds: {
            type: 'integer',
            example: 3600
          }
        }
      },
      CreateExerciseRequest: {
        type: 'object',
        properties: {
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
            example: 'beginner'
          },
          topics: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['conditions', 'vectors', 'lists', 'loops']
          },
          context: {
            type: 'string',
            example: 'supermercado'
          }
        }
      },
      ExerciseResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '65754ef6-1a65-4d7f-b055-21f00943c443'
          },
          userId: {
            type: 'string',
            format: 'uuid',
            example: '2f4df0d3-ef78-4499-8bc2-755982cd8b74'
          },
          level: {
            type: 'string',
            example: 'beginner'
          },
          prompt: {
            type: 'string',
            example: 'Goal: Create an algorithm exercice for a beginner student...'
          },
          content: {
            type: 'string',
            example: 'Title: Lista de compras inteligente...'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-07-03T00:00:00.000Z'
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está disponível',
        responses: {
          200: {
            description: 'API disponível',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse'
                }
              }
            }
          }
        }
      }
    },
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'Cria um novo usuário',
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
          201: {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/UserResponse'
                }
              }
            }
          },
          400: {
            description: 'Dados obrigatórios ausentes ou inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          409: {
            description: 'Usuário já existe',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/login': {
      post: {
        tags: ['Users'],
        summary: 'Autentica um usuário e retorna um token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginResponse'
                }
              }
            }
          },
          400: {
            description: 'Dados obrigatórios ausentes ou inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          401: {
            description: 'E-mail ou senha inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/exercises': {
      get: {
        tags: ['Exercises'],
        summary: 'Lista os exercícios do usuário autenticado',
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: 'Lista de exercícios do usuário autenticado',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/ExerciseResponse'
                  }
                }
              }
            }
          },
          401: {
            description: 'Token JWT ausente ou inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Exercises'],
        summary: 'Cria um exercício para o usuário autenticado',
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateExerciseRequest'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Exercício criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExerciseResponse'
                }
              }
            }
          },
          400: {
            description: 'Nível inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          401: {
            description: 'Token JWT ausente ou inválido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          502: {
            description: 'Falha ao gerar exercício com o provedor LLM',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  }
};
