import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [PrismaModule, AuthModule, SeedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
