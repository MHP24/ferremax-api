import { Controller, Post } from '@nestjs/common';
import { User, ValidRoles } from '@prisma/client';
import { OrdersService } from './orders.service';
import { Auth, GetUser } from '../auth/decorators';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create')
  @Auth(ValidRoles.user)
  createOrder(@GetUser() user: User) {
    return this.ordersService.createOrder(user);
  }
}
