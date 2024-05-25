import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const refreshDocumentation = [
  ApiBearerAuth(),
  ApiOperation({ summary: 'Refresh or revalidate user session' }),
  ApiResponse({
    status: 200,
    description: 'Provides login access and disable previous session',
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
