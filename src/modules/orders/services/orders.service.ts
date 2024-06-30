import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { OrdersFactory } from '../factories/orders.factory';
// * Types
import { CreateOrderDto, CreateOrderParamsDto } from '../dto';
import { OrderType } from '../interfaces';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersFactory: OrdersFactory,
    private readonly prismaService: PrismaService,
  ) {}

  // * Main order creator uses factory of different orders type
  async createOrder(
    user: User,
    orderType: OrderType,
    createOrderParamsDto: CreateOrderParamsDto,
    createOrderDto: CreateOrderDto,
  ) {
    const order = this.ordersFactory.handleOrderCreation(orderType);
    return await order.createOrder(user, createOrderParamsDto, createOrderDto);
  }

  async getMyOrders(user: User) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userId: user.id,
      },
    });

    if (!orders.length) {
      throw new NotFoundException('No orders found');
    }
    return { orders };
  }
}
