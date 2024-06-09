import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsService } from '../../products.service';
import { ProductsModule } from '../../products.module';
import { envs } from '../../../../common/config';
import { productsValidationSchema } from '../schemas/products-validation-schema';

describe('[Integration] products.service.ts', () => {
  let app: INestApplication;
  let productsService: ProductsService;

  // * Modules and services initialization
  beforeEach(async () => {
    const productsModule: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    productsService = productsModule.get<ProductsService>(ProductsService);
    app = productsModule.createNestApplication();
    await app.init();
  });

  // * Seed data generation
  beforeAll(async () => {
    await request(`http://127.0.0.1:${envs.port}`)
      .post('/api/v1/seed')
      .expect(201);
  });

  // * Tests...
  it('Should return a list of 5 products', async () => {
    const products = await productsService.findAll({ limit: 5, page: 1 });
    expect(products.data).toHaveLength(5);
  });

  it('Should return a list of 0 products', async () => {
    const products = await productsService.findAll({ limit: 9, page: 999 });
    expect(products.data).toHaveLength(0);
  });

  it('Should throw NotFoundException', async () => {
    await expect(
      productsService.findBySlug({
        slug: 'undefined-product-slug',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('Should return a product and satisfy Product model', async () => {
    const product = await productsService.findManyProductsById([
      '8278ab0e-c71b-4304-9519-402f58bbcde3',
    ]);

    const { error } = productsValidationSchema.validate(product);
    expect(error).toBeUndefined();
  });
});
