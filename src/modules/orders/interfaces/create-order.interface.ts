import { User } from '@prisma/client';
import { OrderProcessed } from '../types';
import { CreateOrderDto, CreateOrderParamsDto } from '../dto';

export type CreateOrderParams = {
  email: string;
  address: string;
  phoneNumber: string;
};

export interface Order {
  createOrder(
    user: User,
    createOrderParams: CreateOrderParamsDto,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderProcessed>;
}

export type OrderType = 'client' | 'branch';

export interface OrdersCreator {
  handleOrderCreation(orderType: OrderType): Order;
}
