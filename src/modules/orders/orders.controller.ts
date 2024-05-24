import { Body, Controller, Param, Post } from '@nestjs/common';
import { User, ValidRoles } from '@prisma/client';
import { Auth, GetUser } from '../auth/decorators';
import { CreateOrderDto, CreateOrderParamsDto } from './dto';
import { OrdersService } from './services/orders.service';
import { OrderType } from './interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create-ecommerce-order/:cartId')
  @Auth(ValidRoles.user)
  createClientOrder(
    @GetUser() user: User,
    @Param() createOrderParams: CreateOrderParamsDto,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(
      user,
      OrderType.client,
      createOrderParams,
      createOrderDto,
    );
  }

  @Post('/create-pos-order/:cartId')
  @Auth(ValidRoles.seller)
  createBranchOrder(
    @GetUser() user: User,
    @Param() createOrderParams: CreateOrderParamsDto,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(
      user,
      OrderType.branch,
      createOrderParams,
      createOrderDto,
    );
  }
}
