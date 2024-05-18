import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  productBrandsSeed,
  productCategoriesSeed,
  productsSeed,
  usersSeed,
} from './mocks';

@Injectable()
export class SeedService {
  constructor(private readonly prismaService: PrismaService) {}

  async runSeed() {
    await this.prismaService.$transaction([
      // * Delete transaction
      this.prismaService.logAccess.deleteMany({}),
      this.prismaService.user.deleteMany({}),
      this.prismaService.productPriceHistory.deleteMany({}),
      this.prismaService.product.deleteMany({}),
      this.prismaService.productCategory.deleteMany({}),
      this.prismaService.productBrand.deleteMany({}),

      // * Add transaction
      this.prismaService.user.createMany({ data: usersSeed }),
      this.prismaService.productCategory.createMany({
        data: productCategoriesSeed,
      }),
      this.prismaService.productBrand.createMany({
        data: productBrandsSeed,
      }),
      this.prismaService.product.createMany({
        data: productsSeed,
      }),
      this.prismaService.productPriceHistory.createMany({
        data: productsSeed.map((product) => ({
          productId: product.productId,
          price: product.price,
        })),
      }),
    ]);
    return { message: 'Seed executed successfully' };
  }
}
