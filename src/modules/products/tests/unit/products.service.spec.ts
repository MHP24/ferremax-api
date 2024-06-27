import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProductsService } from '../../products.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { FakePrismaService } from './classes';
import { PaginationDto, SlugDto } from '../../../../common/dto';
import { fakeBySlugProductsMock } from './mocks/find-by-slug';
import { findManyProductsByIdMock } from './mocks';

describe('[Unit] products.service.ts', () => {
  let productsService: ProductsService;

  beforeAll(async () => {
    const productsModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useClass: FakePrismaService,
        },
      ],
    }).compile();

    productsService = productsModule.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('Should return 3 products', async () => {
      const paginationDto: PaginationDto = {
        page: 1,
        limit: 3,
      };

      const response = await productsService.findAll(paginationDto);
      expect(response.data).toHaveLength(3);
      expect(response.meta).toBeDefined();
    });

    it('Should return 0 products', async () => {
      const paginationDto: PaginationDto = {
        page: 3,
        limit: 3,
      };

      const response = await productsService.findAll(paginationDto);
      expect(response.data).toHaveLength(0);
      expect(response.meta).toBeDefined();
    });
  });

  describe('findBySlug', () => {
    it('Should return a single product', async () => {
      const slugDto: SlugDto = {
        slug: 'destornillador',
      };

      const result = await productsService.findBySlug(slugDto);
      expect(result).toEqual(
        fakeBySlugProductsMock[slugDto.slug].formattedOutput,
      );
    });

    it('Should throw NotFoundException', async () => {
      const slugDto: SlugDto = {
        slug: 'this-product-does-not-exist',
      };

      try {
        await productsService.findBySlug(slugDto);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Product: ${slugDto.slug} not found`);
      }
    });
  });

  describe('findManyProductsById', () => {
    it('Should return 2 products', async () => {
      const [firstProduct, secondProduct] = findManyProductsByIdMock;

      const result = await productsService.findManyProductsById([
        firstProduct.productId,
        secondProduct.productId,
      ]);
      expect(result).toHaveLength(2);
    });

    it('Should throw NotFoundException', async () => {
      try {
        await productsService.findManyProductsById([
          'invalid-id1',
          'invalid-id2',
          'invalid-id3',
        ]);
        fail('NotFoundException was not thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No products found');
      }
    });
  });
});
