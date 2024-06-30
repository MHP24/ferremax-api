import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
// * Modules
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ShoppingCartsModule } from '../shopping-carts/shopping-carts.module';
import { ProductsModule } from '../products/products.module';
import { StockModule } from '../stock/stock.module';
// * Services
import {
  OrdersService,
  BranchOrdersService,
  ClientOrdersService,
  OrderHandlersService,
} from './services';
import { OrdersFactory } from './factories';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ShoppingCartsModule,
    ProductsModule,
    StockModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersFactory,
    OrdersService,
    OrderHandlersService,
    ClientOrdersService,
    BranchOrdersService,
  ],
})
export class OrdersModule {}
