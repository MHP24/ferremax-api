import { Injectable } from '@nestjs/common';
import { DiscreaseStock } from './types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prismaService: PrismaService) {}

  // * Get stock for a single product in a unique branch
  async getProductStockByBranch(productId: string, branchId: string) {
    const { Product, quantity } =
      await this.prismaService.productStock.findFirst({
        where: {
          productId,
          branchId,
        },
        select: {
          quantity: true,
          Product: {
            select: {
              productId: true,
              name: true,
            },
          },
        },
      });

    return {
      ...Product,
      branchId,
      quantity,
    };
  }

  // TODO:
  discreaseStock(data: DiscreaseStock[]) {
    return data;
  }
}
