import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FakePrismaService } from '../classes';
import { PrismaService } from '../../../prisma/prisma.service';
import { ShoppingCartsService } from '../../shopping-carts.service';
import { ProductsService } from '../../../products/products.service';
import { StockService } from '../../../stock/stock.service';
import {
  createCartUserIdMock,
  createCartUserMock,
  createShoppingCartMock,
  getMyShoppingCartMock,
  invalidUserIdMock,
  productsGroupMock,
  productsMock,
  validUserIdMock,
} from '../mocks';
import { groupProducts } from '../../helpers';

describe('[Unit] shopping-carts.service.ts', () => {
  let shoppingCartsService: ShoppingCartsService;

  beforeAll(async () => {
    const shoppingCartsModule = await Test.createTestingModule({
      providers: [
        ShoppingCartsService,
        ProductsService,
        StockService,
        {
          provide: PrismaService,
          useClass: FakePrismaService,
        },
      ],
    }).compile();

    shoppingCartsService =
      shoppingCartsModule.get<ShoppingCartsService>(ShoppingCartsService);
  });

  describe('getShoppingCart', () => {
    it('Should return a shopping cart (My cart)', async () => {
      const response = await shoppingCartsService.getShoppingCart(
        validUserIdMock,
      );

      expect(response).toEqual(
        getMyShoppingCartMock[validUserIdMock].serviceResponse,
      );
    });

    it('Should throw NotFoundException', async () => {
      try {
        await shoppingCartsService.getShoppingCart(invalidUserIdMock);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Shopping cart not found');
      }
    });
  });

  describe('createShoppingCart', () => {
    it('Should create a shopping cart (no user cart created previously)', async () => {
      const response = await shoppingCartsService.createShoppingCart(
        createCartUserMock,
      );
      expect(response).toEqual(
        createShoppingCartMock[createCartUserIdMock].serviceResponse,
      );
    });
  });

  describe('groupProducts', () => {
    it('Should group products', () => {
      const group = groupProducts(productsMock);
      expect(group).toEqual(productsGroupMock);
      expect(Object.keys(group)).toHaveLength(2);
    });
  });
});
