import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { type ShoppingCart } from './types';
import { type ShoppingCart as PrismaShoppingCart } from '@prisma/client';

@Injectable()
export class ShoppingCartsService {
  constructor(private readonly prismaService: PrismaService) {}

  // * Get shopping cart by userId
  async getUserShoppingCart(userId: string): Promise<ShoppingCart> {
    const userShoppingCart = await this.prismaService.shoppingCart.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        ShoppingCartItem: {
          include: {
            Product: {
              select: {
                productId: true,
                name: true,
                slug: true,
                price: true,
                stock: true,
                images: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    // * Cart existence validation
    if (!userShoppingCart) {
      throw new BadRequestException('Shopping cart not found');
    }

    // * Cart formatting
    const { ShoppingCartItem: items, ...rest } = userShoppingCart;
    return {
      ...rest,
      items: items.map(({ Product, quantity, branchId }) => ({
        product: Product,
        branchId,
        quantity,
      })),
    };
  }

  // * Disable user cart by cartId
  async disableShoppingCartById(cartId: string): Promise<PrismaShoppingCart> {
    return await this.prismaService.shoppingCart.update({
      where: {
        cartId,
      },
      data: {
        isActive: false,
      },
    });
  }
}
