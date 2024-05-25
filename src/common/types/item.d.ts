export type Item = {
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
  branchId: string;
};
