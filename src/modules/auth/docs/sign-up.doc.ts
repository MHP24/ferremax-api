import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const signUpDocumentation = [
  ApiOperation({ summary: 'Create account as client / user' }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
    examples: {
      example1: {
        value: {
          email: 'newuser@domain.com',
          password: 'password123',
        },
      },
    },
  }),
  ApiResponse({
    status: 201,
    description: 'Account created successfully',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                roles: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
              required: ['id', 'email', 'roles'],
            },
          },
        },
      },
    },
  }),
];
