import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { OrdersFactory } from '../factories/orders.factory';
import { CreateOrderDto, CreateOrderParamsDto } from '../dto';
import { OrderType } from '../interfaces';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersFactory: OrdersFactory) {}

  async createOrder(
    user: User,
    orderType: OrderType,
    createOrderParamsDto: CreateOrderParamsDto,
    createOrderDto: CreateOrderDto,
  ) {
    const order = this.ordersFactory.handleOrderCreation(orderType);
    return await order.createOrder(user, createOrderParamsDto, createOrderDto);
  }
}
