import { OrderStatus } from '@prisma/client';

export type OrderItem = {
  productId: string;
  branchId: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type OrderSummary = {
  orderId: string;
  status: OrderStatus;
  date: Date;
  total: number;
};

export type OrderProcessed = OrderSummary & {
  detail: OrderItem[];
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
