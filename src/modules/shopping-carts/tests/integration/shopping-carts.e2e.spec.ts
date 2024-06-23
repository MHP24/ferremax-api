import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { configureApp } from '../../../../common/tests';
import { addToCart, userCredentialsMock } from './mocks';
import { Session } from './types';

describe('[Integration] shopping-carts.spec.ts', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let session: Session;
  let cartId: string;

  // * Config
  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = appModule.get<PrismaService>(PrismaService);
    app = appModule.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeAll(async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(userCredentialsMock);

    const access = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(userCredentialsMock);
    session = access.body;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/shopping-carts/my-cart (GET)', () => {
    it('Should throw 401 (Unauthorized)', async () => {
      const response = await request(app.getHttpServer()).get(
        '/shopping-carts/my-cart',
      );
      expect(response.statusCode).toBe(401);
    });
    it('Should throw 404', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .get('/shopping-carts/my-cart')
        .set({ authorization: `Bearer ${session.token.accessToken}` });
      expect(statusCode).toBe(404);
      expect(body.message).toBe('Shopping cart not found');
    });
  });

  describe('/shopping-carts (POST)', () => {
    it('Should create a shopping cart', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/shopping-carts')
        .set({ authorization: `Bearer ${session.token.accessToken}` });

      const shoppingCarts = await prismaService.shoppingCart.findMany({
        where: {
          userId: session.user.userId,
          isActive: true,
        },
      });

      cartId = body.cartId;

      expect(body.message).toBe('Shopping cart created successfully');
      expect(statusCode).toBe(201);
      expect(shoppingCarts.length).toBe(1);
      expect(body.cartId.length).toBeGreaterThan(10);
    });
  });

  describe('/shopping-carts/add-to-cart/ (PATCH)', () => {
    it('Should add products to cart', async () => {
      // * Create product available to add
      await prismaService.$transaction([
        prismaService.branch.create({ data: addToCart.branchProductMock }),
        prismaService.productBrand.create({ data: addToCart.brandMock }),
        prismaService.productCategory.create({ data: addToCart.categoryMock }),
        prismaService.product.create({ data: addToCart.productMock }),
        prismaService.productStock.create({ data: addToCart.productStockMock }),
      ]);

      const { body, statusCode } = await request(app.getHttpServer())
        .patch(`/shopping-carts/add-to-cart/${cartId}`)
        .set({ authorization: `Bearer ${session.token.accessToken}` })
        .send({
          products: [addToCart.addToCartProductMock],
        });

      expect(body.items).toHaveLength(1);
      expect(statusCode).toBe(200);
    });
  });
});
