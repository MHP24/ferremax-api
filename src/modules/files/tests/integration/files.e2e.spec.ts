import * as fs from 'fs';
import * as path from 'path';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { configureApp } from '../../../../common/tests';
import { envs } from '../../../../common/config';
import {
  fileNameMock,
  invalidDirMock,
  invalidFileNameMock,
  invalidMimeTypeMock,
  validDirMock,
  validMimeTypeMock,
} from './mocks';

describe('[Integration] files.e2e.spec.ts', () => {
  let app: INestApplication;
  const imgDirMock = path.resolve(
    envs.staticFilePath,
    validDirMock,
    validMimeTypeMock,
  );

  beforeAll(async () => {
    // * Add mock dir and image for testing
    fs.mkdirSync(imgDirMock, { recursive: true });
    fs.copyFileSync(
      path.resolve(__dirname, './mocks', fileNameMock),
      path.resolve(imgDirMock, fileNameMock),
    );

    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appModule.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    // * Clear mock dir and image for testing
    fs.rmSync(path.resolve(envs.staticFilePath, 'test'), {
      recursive: true,
      force: true,
    });
  });

  describe('/files/ (GET)', () => {
    it('Should return a file', async () => {
      const response = await request(app.getHttpServer())
        .get(`/files/${validDirMock}/${validMimeTypeMock}/${fileNameMock}`)
        .expect(200);
      expect(response.body).toBeInstanceOf(Buffer);
    });

    it('Should return 404 when file does not exist', async () => {
      const response = await request(app.getHttpServer())
        .get(
          `/files/${validDirMock}/${validMimeTypeMock}/${invalidFileNameMock}`,
        )
        .expect(404);
      expect(response.body.message).toBe(`${invalidFileNameMock} not found`);
    });

    it('Should return 400 for invalid mimeType parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/files/${validDirMock}/${invalidMimeTypeMock}/${fileNameMock}`)
        .expect(400);
      expect(response.body.message[0]).toContain(
        'mimeType must be one of the following values:',
      );
    });
  });

  it('Should return 404 for invalid dir parameter', async () => {
    const response = await request(app.getHttpServer())
      .get(`/files/${invalidDirMock}/${validMimeTypeMock}/${fileNameMock}`)
      .expect(404);
    expect(response.body.message).toBe(`${fileNameMock} not found`);
  });
});
