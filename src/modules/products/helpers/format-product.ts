import { ProductFormatted, TProduct } from '../types';

export const formatProduct = (product: TProduct): ProductFormatted => {
  const { ProductCategory, ProductBrand, productId, ...rest } = product;
  return {
    id: productId,
    category: ProductCategory.name,
    brand: ProductBrand.name,
    ...rest,
  };
};
