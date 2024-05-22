import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
// * Modules
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ShoppingCartsModule } from '../shopping-carts/shopping-carts.module';
import { ProductsModule } from '../products/products.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ShoppingCartsModule,
    ProductsModule,
    StockModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
