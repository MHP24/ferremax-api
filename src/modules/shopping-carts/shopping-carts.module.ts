import { Module } from '@nestjs/common';
import { ShoppingCartsService } from './shopping-carts.service';
import { ShoppingCartsController } from './shopping-carts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, StockModule],
  controllers: [ShoppingCartsController],
  providers: [ShoppingCartsService],
  exports: [ShoppingCartsService],
})
export class ShoppingCartsModule {}
