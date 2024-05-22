import { Body, Controller, Param, Post } from '@nestjs/common';
import { User, ValidRoles } from '@prisma/client';
import { Auth, GetUser } from '../auth/decorators';
import { CreateOrderDto, CreateOrderParamsDto } from './dto';
import { OrdersService } from './services/orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/client/:cartId')
  @Auth(ValidRoles.user)
  createClientOrder(
    @GetUser() user: User,
    @Param() createOrderParams: CreateOrderParamsDto,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(
      'client',
      user,
      createOrderParams,
      createOrderDto,
    );
  }
}
