import { Product } from '@prisma/client';
import { Items, OrderCalculation } from '../types';

export const calculateOrder = (
  items: Items[],
  products: Product[],
): OrderCalculation => {
  return items.reduce(
    (acc: OrderCalculation, { product: { productId }, branchId, quantity }) => {
      const { price } = products.find(
        (product) => product.productId === productId,
      );
      const subtotal = quantity * price;

      return {
        total: acc.total + subtotal,
        detail: [
          ...acc.detail,
          {
            productId,
            branchId,
            quantity,
            price,
            subtotal,
          },
        ],
      };
    },
    {
      total: 0,
      detail: [],
    },
  );
};
