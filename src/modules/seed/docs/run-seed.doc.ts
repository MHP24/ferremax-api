import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const runSeedDocumentation = [
  ApiOperation({ summary: 'Populate database with data' }),
  ApiResponse({
    status: 201,
    description: 'Generated seed data',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          required: ['message'],
        },
      },
    },
  }),
];
