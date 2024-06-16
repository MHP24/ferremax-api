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
    example: 'ced4380c-fbac-450d-8df5-3ab96a012589',
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
              productId: '66631165-1870-41fe-b153-03790dcb9021',
              quantity: 7,
              branchId: '3ede6d7d-91a0-4bb8-89ae-470dfec9f924',
            },
            {
              productId: 'b792420c-ab75-424c-b5d1-732559a1dd95',
              quantity: 1,
              branchId: '3ede6d7d-91a0-4bb8-89ae-470dfec9f924',
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
    status: 400,
    description: 'Invalid branch or product',
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized access (JWT Session required)',
  }),
  ApiResponse({
    status: 404,
    description: 'Shopping cart not found or does not exist',
  }),
];
