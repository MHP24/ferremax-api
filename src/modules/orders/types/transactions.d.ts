import { ShoppingCart } from '@prisma/client';
import { OrderItem } from './order';
import { CreateOrderDto } from '../dto';

export type CreateOrderTransaction = {
  userId: string;
  sellerId?: string;
  branchId?: string;
  shoppingCart: ShoppingCart;
  total: number;
  detail: OrderItem[];
  contactInformation: CreateOrderDto;
};
