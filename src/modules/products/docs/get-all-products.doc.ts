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
                  name: 'Taladro Eléctrico',
                  slug: 'taladro-electrico',
                  price: 80000,
                  images: ['taladro-electrico.jpg'],
                  isActive: true,
                  stock: 60,
                },
                {
                  name: 'Casco de Seguridad',
                  slug: 'casco-seguridad',
                  price: 25000,
                  images: ['casco-seguridad.jpg'],
                  isActive: true,
                  stock: 150,
                },
                {
                  name: 'Sierra Eléctrica',
                  slug: 'sierra-electrica',
                  price: 120000,
                  images: ['sierra-electrica.jpg'],
                  isActive: true,
                  stock: 45,
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
