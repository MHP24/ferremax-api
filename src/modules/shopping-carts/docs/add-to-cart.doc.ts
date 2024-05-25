import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const addToCartDocumentation = [
  ApiBearerAuth(),
  ApiOperation({
    summary: 'Add products to the cart',
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
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
              branchId: { type: 'string' },
            },
            required: ['productId', 'quantity', 'branchId'],
          },
        },
      },
      required: ['products'],
    },
    examples: {
      example1: {
        value: {
          products: [
            {
              productId: '61629914-949e-4ebc-b8cd-c8eef685e1fc',
              quantity: 2,
              branchId: '0e0121d4-d569-4085-881d-3f4a1f857d35',
            },
          ],
        },
      },
    },
  }),
  ApiResponse({
    status: 200,
    description: 'Shopping cart information (updated)',
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
