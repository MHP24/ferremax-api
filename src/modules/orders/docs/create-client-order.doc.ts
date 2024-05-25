import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const createClientOrderDocumentation = [
  ApiBearerAuth(),
  ApiOperation({
    summary:
      'Create order based in a client shopping cart (from e-commerce or equal)',
  }),
  ApiParam({
    name: 'cartId',
    example: 'a0f50782-e954-4f17-9c6b-ee59e0de8afa',
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
          address: 'Casa cliente #123',
          email: 'client@mail.com',
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
              orderId: 'FER-ORDER-332afc65-69b1-41e3-acb9-3b729bb064f8',
              status: 'PENDING',
              date: '2024-05-25T00:13:07.731Z',
              total: 285000,
              detail: [
                {
                  productId: '61629914-949e-4ebc-b8cd-c8eef685e1fc',
                  branchId: '0e0121d4-d569-4085-881d-3f4a1f857d35',
                  quantity: 5,
                  price: 25000,
                  subtotal: 125000,
                },
                {
                  productId: 'd976e5e9-7a36-405e-abc8-6a6b5935879b',
                  branchId: '0e0121d4-d569-4085-881d-3f4a1f857d35',
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
    status: 403,
    description: 'Seller do not have access to this endpoint',
  }),
  ApiResponse({
    status: 404,
    description: 'Shopping cart not found or does not exist',
  }),
];
