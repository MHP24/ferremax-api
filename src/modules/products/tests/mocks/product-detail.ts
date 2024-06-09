import { ProductFormatted, TProduct } from '../../types';

export const productDetailMock: TProduct = {
  productId: '1b499962-ec6c-45be-be6c-f187bd4b179c',
  name: 'Cemento',
  slug: 'cemento',
  price: 30000,
  stock: 13,
  images: ['cemento.jpg'],
  description: 'Cemento de alta calidad para construcciones sólidas.',
  keywords: ['cemento', 'material básico', 'construcción'],
  ProductCategory: { name: 'Materiales de Construcción - Materiales Básicos' },
  ProductBrand: { name: 'Cemex' },
};

export const productDetailFormatted: ProductFormatted = {
  id: '1b499962-ec6c-45be-be6c-f187bd4b179c',
  name: 'Cemento',
  slug: 'cemento',
  price: 30000,
  stock: 13,
  images: ['cemento.jpg'],
  description: 'Cemento de alta calidad para construcciones sólidas.',
  keywords: ['cemento', 'material básico', 'construcción'],
  category: 'Materiales de Construcción - Materiales Básicos',
  brand: 'Cemex',
};
