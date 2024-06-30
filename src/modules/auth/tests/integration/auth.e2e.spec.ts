import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { Hasher } from '../../../../common/adapters';
import { configureApp } from '../../../../common/tests';
import {
  createUserBodyMock,
  invalidCredentialsMock,
  repeatedUserBodyMock,
  signInUserMock,
} from './mocks';
import { resetMocks } from './helpers';

describe('[Integration] auth.e2e.spec.ts', () => {
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
    await resetMocks(prismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/sign-up (POST)', () => {
    it('Should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(createUserBodyMock)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(createUserBodyMock.email);
    });

    it('Should not create a user with existing email', async () => {
      await prismaService.user.create({
        data: repeatedUserBodyMock,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(repeatedUserBodyMock)
        .expect(400);

      expect(response.body.message).toBe('This email already exists');
    });
  });

  describe('/auth/sign-in (POST)', () => {
    it('Should sign in a user', async () => {
      await prismaService.user.create({
        data: {
          email: signInUserMock.email,
          password: await new Hasher().hash(signInUserMock.password),
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInUserMock)
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(signInUserMock.email);
    });

    it('Should not sign in with invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(invalidCredentialsMock)
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
