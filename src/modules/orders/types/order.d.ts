export type OrderItem = {
  name: string;
  thumbnail: string;
  productId: string;
  branchId: string;
  price: number;
  subtotal: number;
  quantity: number;
};

export type OrderSummary = {
  orderId: string;
  userId: string;
  cartId: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderProcessed = {
  order: OrderSummary;
  items: OrderItem[];
};

export type OrderCalculation = {
  total: number;
  detail: {
    productId: string;
    branchId: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
};
