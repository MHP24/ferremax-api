import { Injectable } from '@nestjs/common';
import { OrdersFactory } from '../factories/orders.factory';
import { User } from '@prisma/client';
import { CreateOrderDto, CreateOrderParamsDto } from '../dto';
import { OrderType } from '../interfaces';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersFactory: OrdersFactory) {}

  async createOrder(
    orderType: OrderType,
    user: User,
    createOrderParamsDto: CreateOrderParamsDto,
    createOrderDto: CreateOrderDto,
  ) {
    const order = this.ordersFactory.handleOrderCreation(orderType);
    return await order.createOrder(user, createOrderParamsDto, createOrderDto);
  }
}
