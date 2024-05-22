import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  Order as TOrder,
  OrderStatus,
  User,
  ShoppingCart,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IdGeneratorAdapter } from '../../../common/adapters/interfaces';
import { IdGenerator } from '../../../common/adapters';
import { ShoppingCartsService } from '../../shopping-carts/shopping-carts.service';
import { ProductsService } from '../../products/products.service';
import { StockService } from '../../stock/stock.service';
import { calculateOrder } from '.././helpers';
import { CreateOrderDto, CreateOrderParamsDto } from '.././dto';
import { Order } from '../interfaces';
import { Items, OrderItem, OrderProcessed } from '../types';

@Injectable()
export class ClientOrdersService implements Order {
  private idGenerator: IdGeneratorAdapter = new IdGenerator();
  private logger = new Logger(ClientOrdersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly shoppingCartsService: ShoppingCartsService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
  ) {}

  async createOrder(
    { id: userId }: User,
    { cartId }: CreateOrderParamsDto,
    createClientOrderDto: CreateOrderDto,
  ): Promise<OrderProcessed> {
    // * Validate if the user has unpaid order
    await this.validatePendingOrder(userId);

    // * Get current user shopping cart
    const shoppingCart = await this.shoppingCartsService.getUserShoppingCart(
      userId,
      cartId,
    );

    // * Get all items with the current price updated
    const products = await this.productsService.findManyProductsById(
      shoppingCart.items.map(({ product }) => product.productId),
    );

    // * Check if all products are active and available to buy (without considering stock)
    if (products.length !== shoppingCart.items.length) {
      throw new BadRequestException(
        'Some products are not available, check your shopping cart',
      );
    }

    // * Stock branch validation
    await this.validateStockAvailability(shoppingCart.items);

    // * Subtotal for each item calc
    const { total, detail } = calculateOrder(shoppingCart.items, products);

    // * *** Order creation process...
    return this.processOrderTransaction(
      userId,
      shoppingCart,
      total,
      detail,
      createClientOrderDto,
    );
  }

  // * Get the latest order (for clients only)
  async getLastClientOrder(userId: string): Promise<TOrder> {
    return await this.prismaService.order.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // * Unpaid or double payment prevention orders cases
  async validatePendingOrder(userId: string): Promise<void> {
    const lastClientOrder = await this.getLastClientOrder(userId);
    if (lastClientOrder?.status === OrderStatus.PENDING) {
      throw new BadRequestException(
        'There was an error processing your order ' +
          '(latest order status: payment missing / not processed yet)',
      );
    }
  }

  // * Branch stock validation
  async validateStockAvailability(cartItems: Items[]): Promise<void> {
    const productsBranchStock = await Promise.all(
      cartItems.map(({ product: { productId }, branchId }) =>
        this.stockService.getProductStockByBranch(productId, branchId),
      ),
    );

    const areAllProductsInStock = cartItems.every(
      ({ product: { productId }, branchId, quantity }) =>
        productsBranchStock.find(
          (product) =>
            product.productId === productId && product.branchId === branchId,
        ).quantity >= quantity,
    );

    if (!areAllProductsInStock) {
      throw new BadRequestException('Some products are not in stock');
    }
  }

  // * Final transaction to create order in system
  async processOrderTransaction(
    userId: string,
    shoppingCart: ShoppingCart,
    total: number,
    detail: OrderItem[],
    createClientOrderDto: CreateOrderDto,
  ): Promise<OrderProcessed> {
    try {
      const orderId = this.idGenerator.id('FER-ORDER');

      const [order] = await this.prismaService.$transaction([
        this.prismaService.order.create({
          data: {
            orderId,
            userId,
            cartId: shoppingCart.cartId,
            total,
            ...createClientOrderDto,
          },
        }),
        this.prismaService.orderItem.createMany({
          data: detail.map((item) => ({
            ...item,
            orderId,
          })),
        }),
      ]);

      await Promise.all(
        detail.map((item) => this.stockService.discreaseStock(item)),
      );

      await this.shoppingCartsService.disableShoppingCartById(
        shoppingCart.cartId,
      );

      return {
        orderId,
        status: order.status,
        date: order.createdAt,
        total,
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
