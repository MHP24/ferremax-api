import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsService } from '../../products.service';
import { ProductsModule } from '../../products.module';
import { envs } from '../../../../common/config';
import { productsValidationSchema } from '../schemas';

describe('[Integration] products.service.ts', () => {
  let app: INestApplication;
  let productsService: ProductsService;
  const baseUrl = `http://127.0.0.1:${envs.port}`;

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
    await request(baseUrl).post('/api/v1/seed').expect(201);
  });

  // * Tests...
  it('Should return a list of 5 products', async () => {
    const response = await request(baseUrl)
      .get('/api/v1/products')
      .query({ limit: 5, page: 1 })
      .expect(200);

    expect(response.body.data).toHaveLength(5);
  });

  it('Should return a list of 0 products', async () => {
    const response = await request(baseUrl)
      .get('/api/v1/products')
      .query({ limit: 9, page: 999 })
      .expect(200);

    expect(response.body.data).toHaveLength(0);
  });

  it('Should throw NotFoundException', async () => {
    await request(baseUrl)
      .get('/api/v1/products/slug/undefined-product-slug')
      .expect(404);
  });

  it('Should return a product and satisfy Product model', async () => {
    const product = await productsService.findManyProductsById([
      '8278ab0e-c71b-4304-9519-402f58bbcde3',
    ]);

    const { error } = productsValidationSchema.validate(product);
    expect(error).toBeUndefined();
  });
});
