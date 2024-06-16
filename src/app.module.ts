import { Module } from '@nestjs/common';
// * Modules
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SeedModule } from './modules/seed/seed.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShoppingCartsModule } from './modules/shopping-carts/shopping-carts.module';
import { ProductsModule } from './modules/products/products.module';
import { StockModule } from './modules/stock/stock.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SeedModule,
    ShoppingCartsModule,
    ProductsModule,
    StockModule,
    OrdersModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
