import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IdGeneratorAdapter } from '../../common/adapters/interfaces';
import { IdGenerator } from '../../common/adapters';
import { OrderItem, OrderProcessed } from './types';

@Injectable()
export class OrdersService {
  private idGenerator: IdGeneratorAdapter = new IdGenerator();
  private logger = new Logger(OrdersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createOrder({ id: userId }: User): Promise<OrderProcessed> {
    try {
      // * Validate if user has a shopping cart active
      // TODO: Use ShoppingCartService
      const shoppingCart = await this.prismaService.shoppingCart.findFirst({
        where: {
          userId,
          isActive: true,
        },
      });

      if (!shoppingCart) {
        throw new BadRequestException('Shopping cart not found');
      }

      // * Get items in cart
      // TODO: Use ShoppingCartService
      const itemsInCart = await this.prismaService.shoppingCartItem.findMany({
        where: { cartId: shoppingCart.cartId },
        select: {
          productId: true,
          quantity: true,
        },
      });

      // * Get items with the current price updated
      // TODO: Use ProductsService
      const products = await this.prismaService.product.findMany({
        where: {
          isActive: true,
          productId: {
            in: itemsInCart.map(({ productId }) => productId),
          },
        },
      });

      // * Check if all products are active and available to buy (without considering stock)
      if (products.length !== itemsInCart.length) {
        throw new BadRequestException(
          'Some products are not available, check your shopping cart',
        );
      }

      // * Stock validation before order creation
      const areProductsInStock = itemsInCart.every(
        ({ productId: cartProductId, quantity }) => {
          return (
            products.find(({ productId }) => productId === cartProductId)
              .stock >= quantity
          );
        },
      );

      if (!areProductsInStock) {
        throw new BadRequestException('Some products are not in stock');
      }

      const orderId = this.idGenerator.id('FER-ORDER');

      // * Order items with subtotal calc
      const orderItems = itemsInCart.reduce(
        (acc: OrderItem[], { productId, quantity }) => {
          const { name, price, images } = products.find(
            (product) => product.productId === productId,
          );
          return [
            ...acc,
            {
              name,
              thumbnail: images[0],
              productId,
              price,
              subtotal: quantity * price,
              quantity,
            },
          ];
        },
        [],
      );

      // * Order total
      const total = orderItems.reduce(
        (acc, { subtotal }) => (acc += subtotal),
        0,
      );

      const [order] = await this.prismaService.$transaction([
        // * Order creation
        this.prismaService.order.create({
          data: {
            orderId,
            userId,
            cartId: shoppingCart.cartId,
            total,
          },
        }),
        // * Order items creation
        this.prismaService.orderItem.createMany({
          data: orderItems.map((item) => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        }),
      ]);

      // TODO: Use StockService Update stock

      // TODO: Use ShoppingCartService Clear & disable cart

      return {
        order,
        items: orderItems,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'An unexpected error occurred trying to generate order, try again',
      );
    }
  }
}
