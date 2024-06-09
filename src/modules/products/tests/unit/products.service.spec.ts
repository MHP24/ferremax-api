import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { ProductsService } from '../../products.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaginationDto, SlugDto } from '../../../../common/dto';
import {
  productDetailFormatted,
  productDetailMock,
  productsMock,
} from '../mocks';
import { simpleProductSchema } from '../schemas';
import { formatProduct } from '../../helpers/format-product';

describe('[Unit] products.service.ts', () => {
  let productsService: ProductsService;
  let prismaService: PrismaService;

  // * Products module config
  beforeEach(async () => {
    const productsModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              count: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    productsService = productsModule.get<ProductsService>(ProductsService);
    prismaService = productsModule.get<PrismaService>(PrismaService);
  });

  // * Tests...
  it('Should be defnied products.service.ts', () => {
    expect(productsService).toBeDefined();
  });

  // * findAll method from products.service.ts
  describe('findAll method', () => {
    // *
    it('Should return a list of 4 products with pagination metadata', async () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 5,
      };

      jest.spyOn(prismaService.product, 'count').mockResolvedValueOnce(4);
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValueOnce(productsMock.slice(0, 4));

      const result = await productsService.findAll(paginationDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('page', paginationDto.page);
      expect(result.meta).toHaveProperty('total', 4);
      expect(result.meta).toHaveProperty('lastPage', 1);
    });

    // *
    it('Should return 1 product including minimal required props', async () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 1,
      };

      jest.spyOn(prismaService.product, 'count').mockResolvedValueOnce(1);
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValueOnce([productsMock[0]]);

      const result = await productsService.findAll(paginationDto);

      // * Data (1 product format response)
      expect(result).toHaveProperty('data');
      const { error } = simpleProductSchema.validate(result.data[0]);
      expect(error).toBeUndefined();

      // * Meta format response
      expect(result).toHaveProperty('meta');
      expect(result.meta).toHaveProperty('page', paginationDto.page);
      expect(result.meta).toHaveProperty('total', 1);
      expect(result.meta).toHaveProperty('lastPage', 1);
    });
  });

  // * finBySlug method from products.service.ts
  describe('findBySlug method', () => {
    it('Should throw NotFoundException when product not found', async () => {
      const slugDto: SlugDto = {
        slug: 'undefined-slug-for-testing',
      };

      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValueOnce(null);

      await expect(productsService.findBySlug(slugDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should format product', async () => {
      const slugDto: SlugDto = {
        slug: productsMock[5].slug,
      };

      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(productDetailMock as unknown as Product);

      const result = await productsService.findBySlug(slugDto);

      expect(result).toEqual(formatProduct(productDetailMock));
    });
  });

  // * Format product function
  describe('formatProduct function', () => {
    it('Should format product', async () => {
      expect(formatProduct(productDetailMock)).toEqual(productDetailFormatted);
    });
  });

  // * findManyProductsById method
  describe('findManyProductsById method', () => {
    it('Should return 4 products', async () => {
      const productsMocked = productsMock.slice(0, 4);

      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValueOnce(productsMocked);

      const result = await productsService.findManyProductsById(
        productsMocked.map(({ productId }) => productId),
      );

      expect(result).toHaveLength(productsMocked.length);
    });

    it('Should throw NotFoundException when no products available', async () => {
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValueOnce([]);

      await expect(
        productsService.findManyProductsById(
          productsMock.slice(0, 4).map(({ productId }) => productId),
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
