import { Controller, Get, Param, Body, Patch, Post } from '@nestjs/common';
import { ValidRoles } from '@prisma/client';
import { ShoppingCartsService } from './shopping-carts.service';
import { Auth, GetUser } from '../auth/decorators';
import { AddToCartDto, CartDto } from './dto';
import { User } from '../auth/types';

@Controller('shopping-carts')
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @Get('/my-cart')
  @Auth(ValidRoles.user)
  getMyCart(@GetUser() user: User) {
    return this.shoppingCartsService.getShoppingCart(user.id);
  }

  @Get('/:cartId')
  @Auth(ValidRoles.user, ValidRoles.seller)
  getCart(@GetUser() user: User, @Param() getCartDto: CartDto) {
    return this.shoppingCartsService.getShoppingCart(
      user.id,
      getCartDto.cartId,
    );
  }

  @Patch('/add-to-cart/:cartId')
  @Auth(ValidRoles.user, ValidRoles.seller)
  addToCart(
    @GetUser() user: User,
    @Param() cartDto: CartDto,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.shoppingCartsService.addToCart(user, cartDto, addToCartDto);
  }

  @Post()
  @Auth(ValidRoles.user, ValidRoles.seller)
  createCart(@GetUser() user: User) {
    return this.shoppingCartsService.createShoppingCart(user);
  }
}
