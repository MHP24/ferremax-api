import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IdGeneratorAdapter } from '../../common/adapters/interfaces';
import { IdGenerator } from '../../common/adapters';
import { ShoppingCartsService } from '../shopping-carts/shopping-carts.service';
import { ProductsService } from '../products/products.service';
import { StockService } from '../stock/stock.service';
import { calculateOrder } from './helpers';

@Injectable()
export class OrdersService {
  private idGenerator: IdGeneratorAdapter = new IdGenerator();
  private logger = new Logger(OrdersService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly shoppingCartsService: ShoppingCartsService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
  ) {}

  async createClientOrder({ id: userId }: User) {
    // * Get current user shopping cart
    const shoppingCart = await this.shoppingCartsService.getUserShoppingCart(
      userId,
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
    const productsBranchStock = await Promise.all(
      shoppingCart.items.map(({ product: { productId }, branchId }) =>
        this.stockService.getProductStockByBranch(productId, branchId),
      ),
    );

    const areAllProductsInStock = shoppingCart.items.every(
      ({ product: { productId }, branchId, quantity }) =>
        productsBranchStock.find(
          (product) =>
            product.productId === productId && product.branchId === branchId,
        ).quantity >= quantity,
    );

    if (!areAllProductsInStock) {
      throw new BadRequestException('Some products are not in stock');
    }

    // * *** Order creation process...

    // * Subtotal for each item calc
    const { total, detail } = calculateOrder(shoppingCart.items, products);

    // * Order main transaction
    try {
      const orderId = this.idGenerator.id('FER-ORDER');

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
          data: detail.map((item) => ({
            ...item,
            orderId,
          })),
        }),
      ]);

      // TODO: Use StockService Update stock

      // * Clear current user car
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
