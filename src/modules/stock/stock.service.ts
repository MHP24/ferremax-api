import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DiscreaseStock, DiscreaseStockOutput } from './types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  private logger = new Logger(StockService.name);

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

  // * Get total stock by product id (sum of all branches with the product related)
  async getProductStockById(productId: string): Promise<number> {
    const productStockBranches = await this.prismaService.productStock.findMany(
      {
        where: {
          productId,
        },
        select: {
          quantity: true,
        },
      },
    );
    // * Sum of each branch
    return productStockBranches.reduce(
      (acc, { quantity }) => (acc += quantity),
      0,
    );
  }

  // * Discrease stock by specific quantity and branch
  // * (Also updates the global stock as final output)
  async discreaseStock(
    stockProduct: DiscreaseStock,
  ): Promise<DiscreaseStockOutput> {
    const { productId, branchId, quantity } = stockProduct;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const totalStock = await this.getProductStockById(productId);
    const { quantity: branchStock } =
      await this.prismaService.productStock.findFirst({
        where: {
          productId,
          branchId,
        },
      });

    const totalStockDifference = totalStock - quantity;
    const branchStockDifference = branchStock - quantity;

    // * Stock difference validation
    if (totalStockDifference < 0 || branchStockDifference < 0) {
      throw new BadRequestException(
        'Invalid quantity to discrease and update stock',
      );
    }

    // * Update of stock branch & total stock
    try {
      await this.prismaService.$transaction([
        this.prismaService.productStock.updateMany({
          where: {
            productId,
            branchId,
          },
          data: {
            quantity: branchStockDifference,
          },
        }),
        this.prismaService.product.update({
          where: {
            productId,
          },
          data: {
            stock: totalStockDifference,
          },
        }),
      ]);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        `Failed updating stock for branch: ${branchId} product: ${productId}`,
      );
    }

    return {
      totalStockDifference,
      branchStockDifference,
    };
  }
}
