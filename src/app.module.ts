import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SeedModule } from './modules/seed/seed.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PrismaModule, AuthModule, SeedModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
