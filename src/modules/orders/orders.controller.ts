import { Body, Controller, Post } from '@nestjs/common';
import { User, ValidRoles } from '@prisma/client';
import { OrdersService } from './orders.service';
import { Auth, GetUser } from '../auth/decorators';
import { CreateClientOrderDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/client')
  @Auth(ValidRoles.user)
  createClientOrder(
    @GetUser() user: User,
    @Body() createClientOrderDto: CreateClientOrderDto,
  ) {
    return this.ordersService.createClientOrder(user, createClientOrderDto);
  }
}
