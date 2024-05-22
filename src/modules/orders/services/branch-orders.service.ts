import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User, ShoppingCart } from '@prisma/client';
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
export class BranchOrdersService implements Order {
  private idGenerator: IdGeneratorAdapter = new IdGenerator();
  private logger = new Logger(BranchOrdersService.name);

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
    // * Get current shopping cart
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

    // * Stock branch validation (check if all products are from unique branch branch)
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

  // * Branch stock validation
  // TODO: Refactor this
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
