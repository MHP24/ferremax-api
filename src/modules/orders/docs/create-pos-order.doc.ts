import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const createPosOrderDocumentation = [
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Create order for a client as seller (from pos or branch)',
  }),
  ApiParam({
    name: 'cartId',
    example: '93110f57-b1c2-41d1-a0c5-96f488f6d297',
    description: 'UUID of the cart',
  }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phoneNumber: { type: 'string' },
      },
      required: ['address', 'email', 'phoneNumber'],
    },
    examples: {
      example1: {
        value: {
          address: 'Client house #234',
          email: 'clientferremax@mail.com',
          phoneNumber: '+56930715857',
        },
      },
    },
  }),
  ApiResponse({
    status: 201,
    description: 'Order created',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            orderId: { type: 'string' },
            status: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            total: { type: 'number' },
            detail: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  branchId: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                  subtotal: { type: 'number' },
                },
                required: [
                  'productId',
                  'branchId',
                  'quantity',
                  'price',
                  'subtotal',
                ],
              },
            },
          },
          required: ['orderId', 'status', 'date', 'total', 'detail'],
        },
        examples: {
          example1: {
            value: {
              orderId: 'FER-ORDER-39e72059-a018-4a11-8c55-e1365dcc2154',
              status: 'PENDING',
              date: '2024-05-25T15:42:47.448Z',
              total: 260000,
              detail: [
                {
                  productId: '8b767270-2b14-4100-8520-a65953d0e708',
                  branchId: 'eef1c849-68cf-4aab-96b9-b7d675283b3b',
                  quantity: 4,
                  price: 25000,
                  subtotal: 100000,
                },
                {
                  productId: 'b792420c-ab75-424c-b5d1-732559a1dd95',
                  branchId: 'eef1c849-68cf-4aab-96b9-b7d675283b3b',
                  quantity: 2,
                  price: 80000,
                  subtotal: 160000,
                },
              ],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 400,
    description: 'Invalid order (stock availability, branches, etc)',
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized access (JWT Session required)',
  }),
  ApiResponse({
    status: 403,
    description: 'User / Client do not have access to this endpoint',
  }),
  ApiResponse({
    status: 404,
    description: 'Shopping cart not found or does not exist',
  }),
];
