import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export const getProductBySlugDocumentation = [
  ApiOperation({
    summary: 'Get one product (by slug, unique friendly identifier)',
  }),
  ApiParam({
    name: 'slug',
    example: 'martillo',
  }),
  ApiResponse({
    status: 200,
    description: 'Product',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            category: { type: 'string' },
            brand: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            images: {
              type: 'array',
              items: { type: 'string' },
            },
            description: { type: 'string' },
            keywords: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: [
            'id',
            'category',
            'brand',
            'name',
            'slug',
            'price',
            'stock',
            'images',
            'description',
            'keywords',
          ],
        },
        examples: {
          example1: {
            value: {
              id: 'f8163496-f65e-4135-882c-5ef710cfb194',
              category: 'Herramientas Manuales',
              brand: 'Stanley',
              name: 'Martillo',
              slug: 'martillo',
              price: 20000,
              stock: 150,
              images: ['martillo.jpg'],
              description: 'Martillo de alta calidad.',
              keywords: ['martillo', 'herramienta manual'],
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 404,
    description: 'Product not found',
  }),
];
