export const categoryMock = { categoryId: 'cat1', name: 'Category 1' };
export const brandMock = { brandId: 'bra1', name: 'Brand 1' };

export const getProductsMock = [
  {
    name: 'Product 1',
    slug: 'product-one',
    price: 100,
    isActive: true,
    stock: 10,
    images: [],
    keywords: [],
    brandId: brandMock.brandId,
    categoryId: categoryMock.categoryId,
  },
  {
    name: 'Product 2',
    slug: 'product-two',
    price: 200,
    isActive: true,
    stock: 20,
    images: [],
    keywords: [],
    brandId: brandMock.brandId,
    categoryId: categoryMock.categoryId,
  },
  {
    name: 'Product 3',
    slug: 'product-three',
    price: 300,
    isActive: true,
    stock: 30,
    images: [],
    keywords: [],
    brandId: brandMock.brandId,
    categoryId: categoryMock.categoryId,
  },
];
