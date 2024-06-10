import { Test } from '@nestjs/testing';
import { SeedService } from '../seed.service';
import { SeedModule } from '../seed.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Seed', () => {
  let app: INestApplication;
  let seedService: SeedService;
  const baseUrl = 'http://127.0.0.1:3002';

  beforeEach(async () => {
    const seedModule = await Test.createTestingModule({
      imports: [SeedModule],
    }).compile();

    seedService = seedModule.get<SeedService>(SeedService);
    app = seedModule.createNestApplication();
    await app.init();
  });

  it('Should be defined', () => {
    expect(seedService).toBeDefined();
  });

  it('Should return HTTP Status code 201', async () => {
    const httpRequest = await request(baseUrl).post('/api/v1/seed');

    expect(httpRequest.body).toEqual({ message: 'Seed executed successfully' });
    request(baseUrl).post('/api/v1/seed').expect(201);
  });
});
