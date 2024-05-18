import { Controller, Post, Param } from '@nestjs/common';
import { User, ValidRoles } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { Auth, GetUser } from '../auth/decorators';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create/:cartId')
  @Auth(ValidRoles.user)
  createOrder(@GetUser() user: User, @Param() createOrderDto: CreateOrderDto) {
    console.log({ user, createOrderDto });
    return this.ordersService.create(createOrderDto);
  }
}
