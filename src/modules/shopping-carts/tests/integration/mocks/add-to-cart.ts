export const branchProductMock = {
  branchId: '2258a0e1-066d-4d19-a2bb-a4864e2fef18',
  name: 'Independencia',
  isActive: true,
};

export const categoryMock = {
  categoryId: 'e03eeacf-b6a0-4353-9a6e-e1c11f6f5ea7',
  name: 'Materiales de Construcción - Materiales Básicos',
};

export const brandMock = {
  brandId: '153ccd50-828f-4d38-822b-e0955f5d1472',
  name: 'Holcim',
};

export const productMock = {
  productId: '66631165-1870-41fe-b153-03790dcb9021',
  name: 'Arena',
  slug: 'arena',
  price: 15000,
  stock: 50,
  images: ['arena.jpg'],
  description: 'Arena fina para mezclas de construcción.',
  keywords: ['arena', 'material básico', 'construcción'],
  categoryId: categoryMock.categoryId,
  brandId: brandMock.brandId,
  isActive: true,
};

export const productStockMock = {
  stockId: '77455f01-b1a9-4f9c-b701-010aefef22ae',
  productId: productMock.productId,
  quantity: 50,
  branchId: branchProductMock.branchId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const addToCartProductMock = {
  productId: productMock.productId,
  quantity: 7,
  branchId: branchProductMock.branchId,
};
