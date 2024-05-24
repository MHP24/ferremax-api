import { BadRequestException, Injectable } from '@nestjs/common';
// * Types
import { Order as TOrder, OrderStatus, User } from '@prisma/client';
import { Order } from '../interfaces';
import { OrderProcessed } from '../types';
import { CreateOrderDto, CreateOrderParamsDto } from '.././dto';
// * Services
import { PrismaService } from '../../prisma/prisma.service';
import { ShoppingCartsService } from '../../shopping-carts/shopping-carts.service';
import { ProductsService } from '../../products/products.service';
import { StockService } from '../../stock/stock.service';
import { OrderHandlersService } from './order-handlers.service';
// * Helpers
import { calculateOrder } from '.././helpers';

@Injectable()
export class ClientOrdersService implements Order {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly shoppingCartsService: ShoppingCartsService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
    private readonly orderHandlersService: OrderHandlersService,
  ) {}

  async createOrder(
    { id: userId }: User,
    { cartId }: CreateOrderParamsDto,
    createClientOrderDto: CreateOrderDto,
  ): Promise<OrderProcessed> {
    // * Validate if the user has unpaid order
    await this.validatePendingOrder(userId);

    // * Get current user shopping cart
    const shoppingCart = await this.shoppingCartsService.getShoppingCart(
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
    await this.stockService.validateStockAvailability(shoppingCart.items);

    // * Subtotal for each item calc
    const { total, detail } = calculateOrder(shoppingCart.items, products);

    // * *** Order creation process...
    return this.orderHandlersService.handleOrderCreationTransaction({
      userId,
      shoppingCart,
      total,
      detail,
      contactInformation: createClientOrderDto,
    });
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
}
