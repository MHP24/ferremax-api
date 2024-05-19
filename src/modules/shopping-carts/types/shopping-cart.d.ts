export type ShoppingCart = {
  cartId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: {
    product: {
      isActive: boolean;
      productId: string;
      name: string;
      slug: string;
      price: number;
      stock: number;
      images: string[];
    };
    quantity: number;
  }[];
};
