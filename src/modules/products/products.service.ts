import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  // * Find many products by id as array of ids arg
  async findManyProductsById(ids: string[]) {
    const products = await this.prismaService.product.findMany({
      where: {
        isActive: true,
        productId: {
          in: ids,
        },
      },
    });

    if (!products.length) {
      throw new NotFoundException('No products found');
    }

    return products;
  }
}
