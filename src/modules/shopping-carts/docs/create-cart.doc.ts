import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export const createCartDocumentation = [
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Create an empty shopping cart (user, seller supported)',
  }),
  ApiResponse({
    status: 201,
    description: 'Shopping cart created',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            cartId: { type: 'string' },
            message: { type: 'string' },
          },
          required: ['cartId', 'message'],
        },
        examples: {
          example1: {
            value: {
              cartId: 'fd0495c2-0867-4352-a36b-1a2ebac0daf1',
              message: 'Shopping cart created successfully',
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 400,
    description: 'User already has a shopping cart (users, clients only)',
  }),
];
