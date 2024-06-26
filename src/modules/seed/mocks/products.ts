import { productBrandsSeed } from './product-brands';
import { productCategoriesSeed } from './product-categories';

export const productsSeed = [
  // * Herramientas Manuales
  {
    productId: '8278ab0e-c71b-4304-9519-402f58bbcde3',
    name: 'Martillo',
    slug: 'martillo',
    price: 20000,
    stock: null,
    images: ['martillo.jpg'],
    description: 'Martillo de alta calidad.',
    keywords: ['martillo', 'herramienta manual'],
    categoryId: productCategoriesSeed[0].categoryId,
    brandId: productBrandsSeed[0].brandId,
    isActive: true,
  },
  {
    productId: '50486796-9fe9-42e7-90f1-968e0282d3bb',
    name: 'Destornillador',
    slug: 'destornillador',
    price: 15000,
    stock: null,
    images: ['destornillador.jpg'],
    description: 'Destornillador con mango ergonómico.',
    keywords: ['destornillador', 'herramienta manual'],
    categoryId: productCategoriesSeed[0].categoryId,
    brandId: productBrandsSeed[1].brandId,
    isActive: true,
  },
  {
    productId: '8b767270-2b14-4100-8520-a65953d0e708',
    name: 'Llave Inglesa',
    slug: 'llave-inglesa',
    price: 25000,
    stock: null,
    images: ['llave-inglesa.jpg'],
    description: 'Llave inglesa ajustable de alta resistencia.',
    keywords: ['llave inglesa', 'herramienta manual'],
    categoryId: productCategoriesSeed[0].categoryId,
    brandId: productBrandsSeed[2].brandId,
    isActive: true,
  },

  // * Herramientas Eléctricas
  {
    productId: 'b792420c-ab75-424c-b5d1-732559a1dd95',
    name: 'Taladro Eléctrico',
    slug: 'taladro-electrico',
    price: 80000,
    stock: null,
    images: ['taladro-electrico.jpg'],
    description: 'Taladro eléctrico de gran potencia.',
    keywords: ['taladro', 'herramienta eléctrica'],
    categoryId: productCategoriesSeed[1].categoryId,
    brandId: productBrandsSeed[3].brandId,
    isActive: true,
  },
  {
    productId: 'e2c286a3-a5d8-4a7f-ac1d-70e01acd3f90',
    name: 'Sierra Eléctrica',
    slug: 'sierra-electrica',
    price: 120000,
    stock: null,
    images: ['sierra-electrica.jpg'],
    description: 'Sierra eléctrica para cortes precisos.',
    keywords: ['sierra', 'herramienta eléctrica'],
    categoryId: productCategoriesSeed[1].categoryId,
    brandId: productBrandsSeed[4].brandId,
    isActive: true,
  },

  // * Materiales de Construcción - Materiales Básicos
  {
    productId: '1b499962-ec6c-45be-be6c-f187bd4b179c',
    name: 'Cemento',
    slug: 'cemento',
    price: 30000,
    stock: null,
    images: ['cemento.jpg'],
    description: 'Cemento de alta calidad para construcciones sólidas.',
    keywords: ['cemento', 'material básico', 'construcción'],
    categoryId: productCategoriesSeed[2].categoryId,
    brandId: productBrandsSeed[5].brandId,
    isActive: true,
  },
  {
    productId: '66631165-1870-41fe-b153-03790dcb9021',
    name: 'Arena',
    slug: 'arena',
    price: 15000,
    stock: null,
    images: ['arena.jpg'],
    description: 'Arena fina para mezclas de construcción.',
    keywords: ['arena', 'material básico', 'construcción'],
    categoryId: productCategoriesSeed[2].categoryId,
    brandId: productBrandsSeed[6].brandId,
    isActive: true,
  },

  // * Equipos de Seguridad
  {
    productId: '8202a4fd-33eb-4e35-b565-69826c19915e',
    name: 'Casco de Seguridad',
    slug: 'casco-seguridad',
    price: 25000,
    stock: null,
    images: ['casco-seguridad.jpg'],
    description: 'Casco de seguridad resistente para trabajos en altura.',
    keywords: ['casco', 'equipo de seguridad'],
    categoryId: productCategoriesSeed[4].categoryId,
    brandId: productBrandsSeed[7].brandId,
    isActive: true,
  },
  {
    productId: 'e1b00752-37fe-41af-82a2-5e07391f229d',
    name: 'Guantes de Protección',
    slug: 'guantes-proteccion',
    price: 10000,
    stock: null,
    images: ['guantes-proteccion.jpg'],
    description: 'Guantes de protección para trabajos manuales.',
    keywords: ['guantes', 'equipo de seguridad'],
    categoryId: productCategoriesSeed[4].categoryId,
    brandId: productBrandsSeed[8].brandId,
    isActive: true,
  },
];
