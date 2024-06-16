export type ShoppingCart = {
  cartId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: {
    quantity: number;
    branchId: string;
    itemId: string;
    product: {
      isActive: boolean;
      productId: string;
      name: string;
      slug: string;
      price: number;
      stock: number;
      images: string[];
    };
  }[];
};

export type ProductCartGroup = {
  productId: string;
  quantity: number;
  branchId: string;
};

export type CreateShoppingCart = {
  cartId: string;
  message: string;
};
