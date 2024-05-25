import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const signInDocumentation = [
  ApiOperation({ summary: 'Start session using an existing account' }),
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
          email: 'user1@example.com',
          password: 'password123',
        },
      },
    },
  }),
  ApiResponse({
    status: 201,
    description: 'Access granted (JWTs and user information)',
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
            token: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                expiresIn: { type: 'number' },
              },
              required: ['accessToken', 'refreshToken', 'expiresIn'],
            },
          },
        },
      },
    },
  }),
];
