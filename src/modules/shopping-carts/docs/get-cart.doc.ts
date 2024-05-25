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
    example: 'ced4380c-fbac-450d-8df5-3ab96a012589',
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
        examples: {
          example1: {
            value: {
              cartId: 'ced4380c-fbac-450d-8df5-3ab96a012589',
              userId: 'f65fc959-225a-4817-8867-8b9d98f6b092',
              isActive: true,
              createdAt: '2024-05-25T16:07:22.552Z',
              updatedAt: '2024-05-25T16:07:22.552Z',
              items: [
                {
                  itemId: '943faff1-5839-45d4-8cda-654784368762',
                  branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
                  quantity: 3,
                  product: {
                    productId: '8278ab0e-c71b-4304-9519-402f58bbcde3',
                    name: 'Martillo',
                    slug: 'martillo',
                    price: 20000,
                    stock: 150,
                    images: ['martillo.jpg'],
                    isActive: true,
                  },
                },
                {
                  itemId: '68ba705a-9e0b-48da-84e1-596fad822c96',
                  branchId: 'd765d671-7f5c-445e-9b96-3d1ef9ad7e80',
                  quantity: 2,
                  product: {
                    productId: '50486796-9fe9-42e7-90f1-968e0282d3bb',
                    name: 'Destornillador',
                    slug: 'destornillador',
                    price: 15000,
                    stock: 300,
                    images: ['destornillador.jpg'],
                    isActive: true,
                  },
                },
              ],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 401,
    description: 'Unauthorized access',
  }),
  ApiResponse({
    status: 404,
    description: 'Shopping cart not found or does not exist',
  }),
];
