import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const getCartDocumentation = [
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Get shopping cart by id and user (sellers supported)',
  }),
  ApiParam({
    name: 'cartId',
    example: 'a0f50782-e954-4f17-9c6b-ee59e0de8afa',
    description: 'UUID of the cart',
  }),
  ApiResponse({
    status: 200,
    description: 'Shopping cart information',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            cartId: { type: 'string' },
            userId: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  itemId: { type: 'string' },
                  branchId: { type: 'string' },
                  quantity: { type: 'number' },
                  product: {
                    type: 'object',
                    properties: {
                      productId: { type: 'string' },
                      name: { type: 'string' },
                      slug: { type: 'string' },
                      price: { type: 'number' },
                      stock: { type: 'number' },
                      images: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      isActive: { type: 'boolean' },
                    },
                    required: [
                      'productId',
                      'name',
                      'slug',
                      'price',
                      'stock',
                      'images',
                      'isActive',
                    ],
                  },
                },
                required: ['itemId', 'branchId', 'quantity', 'product'],
              },
            },
          },
          required: [
            'cartId',
            'userId',
            'isActive',
            'createdAt',
            'updatedAt',
            'items',
          ],
        },
      },
    },
  }),
  ApiResponse({
    status: 404,
    description: 'Shopping cart not found or does not exist',
  }),
];
