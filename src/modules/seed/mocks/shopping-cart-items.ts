import { branchesSeed } from './branches';
import { productsSeed } from './products';
import { shoppingCartsSeed } from './shopping-carts';

export const shoppingCartItemsSeed = [
  // * Cart 1
  {
    productId: productsSeed[0].productId,
    quantity: 3,
    cartId: shoppingCartsSeed[0].cartId,
    branchId: branchesSeed[1].branchId,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    productId: productsSeed[1].productId,
    quantity: 2,
    cartId: shoppingCartsSeed[0].cartId,
    branchId: branchesSeed[1].branchId,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // * Cart 2
  {
    productId: productsSeed[2].productId,
    quantity: 4,
    cartId: shoppingCartsSeed[1].cartId,
    branchId: branchesSeed[2].branchId,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    productId: productsSeed[3].productId,
    quantity: 2,
    cartId: shoppingCartsSeed[1].cartId,
    branchId: branchesSeed[2].branchId,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
