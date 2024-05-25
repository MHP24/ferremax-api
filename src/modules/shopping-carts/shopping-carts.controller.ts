import { Controller, Get, Param, Body, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidRoles } from '@prisma/client';
import { ShoppingCartsService } from './shopping-carts.service';
import { Auth, GetUser } from '../auth/decorators';
import { AddToCartDto, CartDto } from './dto';
import { User } from '../auth/types';
import { Swagger } from '../../common/swagger/decorators';
import {
  addToCartDocumentation,
  createCartDocumentation,
  getCartDocumentation,
  getMyCartDocumentation,
} from './docs';

@ApiTags('shopping-carts')
@Controller('shopping-carts')
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @Get('/my-cart')
  @Swagger(getMyCartDocumentation)
  @Auth(ValidRoles.user)
  getMyCart(@GetUser() user: User) {
    return this.shoppingCartsService.getShoppingCart(user.id);
  }

  @Get('/:cartId')
  @Swagger(getCartDocumentation)
  @Auth(ValidRoles.user, ValidRoles.seller)
  getCart(@GetUser() user: User, @Param() getCartDto: CartDto) {
    return this.shoppingCartsService.getShoppingCart(
      user.id,
      getCartDto.cartId,
    );
  }

  @Patch('/add-to-cart/:cartId')
  @Swagger(addToCartDocumentation)
  @Auth(ValidRoles.user, ValidRoles.seller)
  addToCart(
    @GetUser() user: User,
    @Param() cartDto: CartDto,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.shoppingCartsService.addToCart(user, cartDto, addToCartDto);
  }

  @Post()
  @Swagger(createCartDocumentation)
  @Auth(ValidRoles.user, ValidRoles.seller)
  createCart(@GetUser() user: User) {
    return this.shoppingCartsService.createShoppingCart(user);
  }
}
