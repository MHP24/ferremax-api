import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// * Services
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { ShoppingCartsService } from '../../../modules/shopping-carts/shopping-carts.service';
import { StockService } from '../../../modules/stock/stock.service';
// * Types
import { CreateOrderTransaction, OrderProcessed } from '../types';
// * ...
import { IdGenerator } from '../../../common/adapters';
import { IdGeneratorAdapter } from '../../../common/adapters/interfaces';

@Injectable()
export class OrderHandlersService {
  private idGenerator: IdGeneratorAdapter = new IdGenerator();
  private logger = new Logger(OrderHandlersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly shoppingCartsService: ShoppingCartsService,
    private readonly stockService: StockService,
  ) {}

  // * Main database transaction & interactions to store the order in system
  async handleOrderCreationTransaction(
    props: CreateOrderTransaction,
  ): Promise<OrderProcessed> {
    try {
      const orderId = this.idGenerator.id('FER-ORDER');
      const { contactInformation, detail, shoppingCart, ...rest } = props;

      // * Main transaction to create order and items related
      const [order] = await this.prismaService.$transaction([
        this.prismaService.order.create({
          data: {
            orderId,
            ...rest,
            cartId: shoppingCart.cartId,
            ...contactInformation,
          },
        }),
        this.prismaService.orderItem.createMany({
          data: detail.map((item) => ({
            ...item,
            orderId,
          })),
        }),
      ]);

      // * Stock adjustment
      await Promise.all(
        detail.map((item) => this.stockService.discreaseStock(item)),
      );

      // * Shopping cart disable
      await this.shoppingCartsService.disableShoppingCartById(
        shoppingCart.cartId,
      );

      return {
        orderId,
        status: order.status,
        date: order.createdAt,
        total: order.total,
        detail,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(
        'An unexpected error occurred trying to generate the order, try again',
      );
    }
  }
}
