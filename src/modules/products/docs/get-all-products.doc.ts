import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const getAllProductsDocumentation = [
  ApiOperation({ summary: 'Get all products (with pagination)' }),
  ApiResponse({
    status: 200,
    description: 'Products',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  price: { type: 'number' },
                  images: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  isActive: { type: 'boolean' },
                  stock: { type: 'number' },
                },
                required: [
                  'name',
                  'slug',
                  'price',
                  'images',
                  'isActive',
                  'stock',
                ],
              },
            },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                results: { type: 'number' },
                total: { type: 'number' },
                lastPage: { type: 'number' },
              },
              required: ['page', 'results', 'total', 'lastPage'],
            },
          },
          required: ['data', 'meta'],
        },
        examples: {
          example1: {
            value: {
              data: [
                {
                  name: 'Cemento',
                  slug: 'cemento',
                  price: 30000,
                  images: ['cemento.jpg'],
                  isActive: true,
                  stock: 300,
                },
                {
                  name: 'Destornillador',
                  slug: 'destornillador',
                  price: 15000,
                  images: ['destornillador.jpg'],
                  isActive: true,
                  stock: 298,
                },
                {
                  name: 'Arena',
                  slug: 'arena',
                  price: 15000,
                  images: ['arena.jpg'],
                  isActive: true,
                  stock: 593,
                },
              ],
              meta: {
                page: 1,
                results: 3,
                total: 9,
                lastPage: 3,
              },
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 400,
    description: 'Invalid page or limit value (consider max)',
  }),
];
