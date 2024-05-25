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
    example: 'ced4380c-fbac-450d-8df5-3ab96a012589',
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
              orderId: 'FER-ORDER-51d300a2-4bd1-457b-a219-fcbba2b9cc82',
              status: 'PENDING',
              date: '2024-05-25T15:43:35.831Z',
              total: 90000,
              detail: [
                {
                  productId: '8278ab0e-c71b-4304-9519-402f58bbcde3',
                  branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
                  quantity: 3,
                  price: 20000,
                  subtotal: 60000,
                },
                {
                  productId: '50486796-9fe9-42e7-90f1-968e0282d3bb',
                  branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
                  quantity: 2,
                  price: 15000,
                  subtotal: 30000,
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
    description: 'Seller do not have access to this endpoint',
  }),
  ApiResponse({
    status: 404,
    description: 'Shopping cart not found or does not exist',
  }),
];
