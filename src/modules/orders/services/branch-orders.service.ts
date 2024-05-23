import { BadRequestException, Injectable } from '@nestjs/common';
// * Types
import { User } from '@prisma/client';
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
export class BranchOrdersService implements Order {
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
    createOrderDto: CreateOrderDto,
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

    // * Stock branch validation (check if all products are from unique branch)
    const branchId = await this.getBranchByUser(userId);
    await this.stockService.validateStockAvailability(
      shoppingCart.items,
      branchId,
    );

    // * Subtotal for each item calc
    const { total, detail } = calculateOrder(shoppingCart.items, products);

    // * *** Order creation process...
    return this.orderHandlersService.handleOrderCreationTransaction({
      userId,
      sellerId: userId,
      branchId,
      shoppingCart,
      total,
      detail,
      contactInformation: createOrderDto,
    });
  }

  // * Get branch by specific user (workers/sellers cases)
  async getBranchByUser(userId: string) {
    const branch = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        branchId: true,
      },
    });

    if (!branch) {
      throw new BadRequestException(`No branch found for user: ${userId}`);
    }

    return branch.branchId;
  }
}
