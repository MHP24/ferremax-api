import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './common/config';
import { swaggerConfig } from './common/swagger/config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const prefix = '/api/v1';
  // * base-url/api/v1/...
  app.setGlobalPrefix(prefix);

  // * Pipe validator for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // * Swagger
  swaggerConfig(prefix, app);

  // * Proxy config
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  // * Server listening initialization
  await app.listen(envs.port);
  logger.log(`App ready on port ${envs.port} 🚀`);
}
bootstrap();
