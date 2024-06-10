import { ProductCartDto } from '../dto';
import { ProductCartGroup } from '../types';

export const groupProducts = (
  products: ProductCartDto[],
): Record<string, ProductCartGroup> => {
  return products.reduce(
    (
      acc: Record<string, ProductCartGroup>,
      { productId, quantity, branchId },
    ) => {
      // * Unique id composed by productId and branchId
      // * (Multi group in case same product id, different branch)
      const key = `${productId}|${branchId}`;
      if (!acc[key]) {
        return { ...acc, [key]: { productId, quantity, branchId } };
      }

      return {
        ...acc,
        [key]: { ...acc[key], quantity: acc[key].quantity + quantity },
      };
    },
    {},
  );
};
