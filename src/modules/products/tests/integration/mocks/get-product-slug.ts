export const slugCategoryMock = { categoryId: 'cat2', name: 'Category 2' };
export const slugBrandMock = { brandId: 'bra2', name: 'Brand 2' };

export const productSlugMock = {
  name: 'Product 4',
  slug: 'product-four',
  price: 400,
  isActive: true,
  stock: 40,
  images: [],
  keywords: [],
  brandId: slugBrandMock.brandId,
  categoryId: slugCategoryMock.categoryId,
};

export const invalidSlug = '123';
export const nonExistingSlug = 'non-existing-slug';
