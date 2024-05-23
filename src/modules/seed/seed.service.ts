import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  branchesSeed,
  productBrandsSeed,
  productCategoriesSeed,
  productsSeed,
  productsStockSeed,
  shoppingCartItemsSeed,
  shoppingCartsSeed,
  usersSeed,
} from './mocks';
import { HasherAdapter } from '../../common/adapters/interfaces';
import { Hasher } from '../../common/adapters';

@Injectable()
export class SeedService {
  private hasher: HasherAdapter = new Hasher();
  constructor(private readonly prismaService: PrismaService) {}

  getProductStock(productId: string): number {
    return productsStockSeed
      .filter((product) => product.productId === productId)
      .reduce((acc, { quantity }) => (acc += quantity), 0);
  }

  async runSeed() {
    await this.prismaService.$transaction([
      // * Delete transaction
      this.prismaService.logAccess.deleteMany({}),
      this.prismaService.orderItem.deleteMany({}),
      this.prismaService.order.deleteMany({}),
      this.prismaService.shoppingCartItem.deleteMany({}),
      this.prismaService.shoppingCart.deleteMany({}),
      this.prismaService.user.deleteMany({}),
      this.prismaService.productStock.deleteMany({}),
      this.prismaService.productPriceHistory.deleteMany({}),
      this.prismaService.product.deleteMany({}),
      this.prismaService.productBrand.deleteMany({}),
      this.prismaService.productCategory.deleteMany({}),
      this.prismaService.branch.deleteMany({}),

      // * Add transaction

      // * Branches
      this.prismaService.branch.createMany({
        data: branchesSeed,
      }),
      // * Users
      this.prismaService.user.createMany({
        data: await Promise.all(
          usersSeed.map(async ({ password, ...rest }) => ({
            ...rest,
            password: await this.hasher.hash(password),
          })),
        ),
      }),
      // * Products
      this.prismaService.productCategory.createMany({
        data: productCategoriesSeed,
      }),
      this.prismaService.productBrand.createMany({
        data: productBrandsSeed,
      }),
      this.prismaService.product.createMany({
        data: productsSeed.map((product) => ({
          ...product,
          stock: this.getProductStock(product.productId),
        })),
      }),
      this.prismaService.productStock.createMany({
        data: productsStockSeed,
      }),
      this.prismaService.productPriceHistory.createMany({
        data: productsSeed.map((product) => ({
          productId: product.productId,
          price: product.price,
        })),
      }),
      // * Shopping carts
      this.prismaService.shoppingCart.createMany({
        data: shoppingCartsSeed,
      }),
      this.prismaService.shoppingCartItem.createMany({
        data: shoppingCartItemsSeed,
      }),
    ]);
    return { message: 'Seed executed successfully' };
  }
}
