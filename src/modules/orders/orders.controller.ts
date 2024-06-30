import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User, ValidRoles } from '@prisma/client';
import { Auth, GetUser } from '../auth/decorators';
import { CreateOrderDto, CreateOrderParamsDto } from './dto';
import { OrdersService } from './services/orders.service';
import { OrderType } from './interfaces';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Swagger } from '../../common/swagger/decorators';
import {
  createClientOrderDocumentation,
  createPosOrderDocumentation,
} from './docs';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create-ecommerce-order/:cartId')
  @Swagger(createClientOrderDocumentation)
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
  @Swagger(createPosOrderDocumentation)
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

  @Get('/my-orders')
  @Auth(ValidRoles.user)
  getMyOrders(@GetUser() user: User) {
    return this.ordersService.getMyOrders(user);
  }
}
