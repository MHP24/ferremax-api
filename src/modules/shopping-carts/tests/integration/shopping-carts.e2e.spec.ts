import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { configureApp } from '../../../../common/tests';
import { addToCart, userCredentialsMock } from './mocks';
import { resetDatabae } from './helpers';

describe('[Integration] shopping-carts.spec.ts', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authorization: string;
  let userId: string;

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

  // * Database cleaning
  beforeAll(async () => {
    await resetDatabae(prismaService);
  });

  // * Credentials creation
  beforeAll(async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(userCredentialsMock);

    await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(userCredentialsMock);

    const { body } = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send(userCredentialsMock);
    authorization = `Bearer ${body.token.accessToken}`;
    userId = body.user.id;
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
        .set({ authorization });

      expect(statusCode).toBe(404);
      expect(body.message).toBe('Shopping cart not found');
    });
  });

  describe('/shopping-carts (POST)', () => {
    it('Should create a shopping cart', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .post('/shopping-carts')
        .set({ authorization });

      await prismaService.shoppingCart.deleteMany({});

      expect(body.message).toBe('Shopping cart created successfully');
      expect(statusCode).toBe(201);
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

      // * Create shopping cart
      const {
        body: { cartId },
      } = await request(app.getHttpServer())
        .post('/shopping-carts/')
        .set({ authorization });

      const shoppingCarts = await prismaService.shoppingCart.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      // * Add it
      const { body, statusCode } = await request(app.getHttpServer())
        .patch(`/shopping-carts/add-to-cart/${cartId}`)
        .set({ authorization })
        .send({
          products: [addToCart.addToCartProductMock],
        });

      expect(shoppingCarts).toHaveLength(1);
      expect(body.items).toHaveLength(1);
      expect(body.cartId).toBe(cartId);
      expect(statusCode).toBe(200);
    });
  });
});
