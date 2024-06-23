import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { configureApp } from '../../../../common/tests';
import {
  brandMock,
  categoryMock,
  getProductsMock,
  invalidSlug,
  nonExistingSlug,
  productSlugMock,
  slugBrandMock,
  slugCategoryMock,
} from './mocks';

describe('[Integration] Products', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    configureApp(app);
    await app.init();

    prismaService = appModule.get<PrismaService>(PrismaService);
  });

  beforeAll(async () => {
    await prismaService.$transaction([
      prismaService.product.deleteMany({
        where: {
          slug: {
            in: [
              productSlugMock.slug,
              ...getProductsMock.map(({ slug }) => slug),
            ],
          },
        },
      }),
      prismaService.productCategory.deleteMany({
        where: {
          categoryId: {
            in: [categoryMock.categoryId, slugCategoryMock.categoryId],
          },
        },
      }),
      prismaService.productBrand.deleteMany({
        where: { brandId: { in: [brandMock.brandId, slugBrandMock.brandId] } },
      }),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/products (GET)', () => {
    it('Should get a paginated list of 2 products', async () => {
      await prismaService.$transaction([
        prismaService.productCategory.create({
          data: categoryMock,
        }),
        prismaService.productBrand.create({
          data: brandMock,
        }),
        prismaService.product.createMany({
          data: getProductsMock,
        }),
      ]);

      const response = await request(app.getHttpServer())
        .get('/products')
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.lastPage).toBe(2);
    });
  });

  describe('/products/slug/:slug (GET)', () => {
    it('Should get a product by slug', async () => {
      await prismaService.$transaction([
        prismaService.productCategory.create({
          data: slugCategoryMock,
        }),

        prismaService.productBrand.create({
          data: slugBrandMock,
        }),

        prismaService.product.create({
          data: productSlugMock,
        }),
      ]);

      const response = await request(app.getHttpServer())
        .get(`/products/slug/${productSlugMock.slug}`)
        .expect(200);

      expect(response.body.name).toBe(productSlugMock.name);
      expect(response.body.slug).toBe(productSlugMock.slug);
    });

    it('Should return 404 for a non-existing product', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/slug/${nonExistingSlug}`)
        .expect(404);

      expect(response.body.message).toBe(
        `Product: ${nonExistingSlug} not found`,
      );
    });

    it('Should return validation error for invalid slug', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/slug/${invalidSlug}`)
        .expect(400);
      expect(response.body.message).toEqual(['Invalid slug format']);
    });
  });
});
