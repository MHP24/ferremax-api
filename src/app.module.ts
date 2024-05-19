import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SeedModule } from './modules/seed/seed.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShoppingCartsModule } from './modules/shopping-carts/shopping-carts.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SeedModule,
    OrdersModule,
    ShoppingCartsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
