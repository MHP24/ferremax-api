import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShoppingCart, type ShoppingCart } from './types';
import {
  ValidRoles,
  type ShoppingCart as PrismaShoppingCart,
} from '@prisma/client';
import { User } from '../auth/types';
import { AddToCartDto, CartDto } from './dto';
import { ProductsService } from '../products/products.service';
import { StockService } from '../stock/stock.service';
import { groupProducts } from './helpers';
import { shoppingCartQueryDetail } from './constants';

@Injectable()
export class ShoppingCartsService {
  logger = new Logger(ShoppingCartsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly stockService: StockService,
  ) {}

  // * Get shopping cart by userId and cartId
  async getShoppingCart(
    userId: string,
    // * To handle shopping carts without cart id and only userId (natural users case)
    cartId: string | undefined = undefined,
  ): Promise<ShoppingCart> {
    const userShoppingCart = await this.prismaService.shoppingCart.findFirst({
      where: {
        userId,
        cartId: cartId ?? {
          contains: '-',
        },
        isActive: true,
      },
      ...shoppingCartQueryDetail,
    });

    // * Cart existence validation
    if (!userShoppingCart) {
      throw new NotFoundException('Shopping cart not found');
    }

    // * Cart formatting
    const { ShoppingCartItem: items, ...rest } = userShoppingCart;
    return {
      ...rest,
      items: items.map(({ Product, quantity, branchId, itemId }) => ({
        itemId,
        branchId,
        quantity,
        product: Product,
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

  // * Create shopping carts for users & sellers
  async createShoppingCart(user: User): Promise<CreateShoppingCart> {
    // * Validate cart existence
    let userCart: ShoppingCart | null = null;

    try {
      userCart = await this.getShoppingCart(user.id);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(error);
        throw new BadRequestException(
          'Unexpected error trying to create shopping cart',
        );
      }
    }

    // * Max 1 cart per users (clients)
    if (user.roles.includes(ValidRoles.user) && userCart) {
      throw new BadRequestException(
        'Cannot create shopping cart for this user, already has one',
      );
    }

    const shoppingCart = await this.prismaService.shoppingCart.create({
      data: {
        userId: user.id,
      },
    });

    return {
      cartId: shoppingCart.cartId,
      message: 'Shopping cart created successfully',
    };
  }

  // * Add to cart
  async addToCart(
    user: User,
    cartDto: CartDto,
    addToCartDto: AddToCartDto,
  ): Promise<ShoppingCart> {
    const currentShoppingCart = await this.getShoppingCart(
      user.id,
      cartDto.cartId,
    );

    // * In case repeated products grouped by id first
    const productsGroup = groupProducts(addToCartDto.products);

    // * Keys and ids for products
    const productsKeys = Object.keys(productsGroup);
    const productIds = [
      ...new Set(productsKeys.map((key) => key.split('|')[0])),
    ];
    const productsToAdd = Object.values(productsGroup);

    // * Products from db & found from ids
    const products = await this.productsService.findManyProductsById(
      productIds,
    );

    if (products.length < productIds.length) {
      throw new BadRequestException('Error: some products could not be found');
    }

    // * Validate branches existence for every stock product
    await Promise.all(
      productsToAdd.map(({ productId, branchId }) =>
        this.stockService.getProductStockByBranch(productId, branchId),
      ),
    );

    // * Recalc for quantities in shopping cart items
    productsToAdd.forEach(async (item) => {
      const product = currentShoppingCart.items.find(
        ({ product, branchId }) =>
          product.productId === item.productId && branchId === item.branchId,
      );

      // * Update quantity
      if (product) {
        await this.updateItemQuantity(
          product.itemId,
          product.quantity + item.quantity,
        );
        return;
      }

      // * Add the new product
      await this.addItem(
        item.productId,
        item.quantity,
        currentShoppingCart.cartId,
        item.branchId,
      );
    });

    return await this.getShoppingCart(user.id, cartDto.cartId);
  }

  // * Update existing quantity can be used for + or -
  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    await this.prismaService.shoppingCartItem.update({
      where: {
        itemId,
      },
      data: {
        quantity,
      },
    });
  }

  // * Add new item that doesnt exist in list
  async addItem(
    productId: string,
    quantity: number,
    cartId: string,
    branchId: string,
  ): Promise<void> {
    await this.prismaService.shoppingCartItem.create({
      data: {
        productId,
        quantity,
        cartId,
        branchId,
      },
    });
  }
}
