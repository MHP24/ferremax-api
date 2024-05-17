import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './common/config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  // * base-url/api/v1/...
  app.setGlobalPrefix('/api/v1');

  // * Pipe validator for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // * Server listening initialization
  await app.listen(envs.port);
  logger.log(`App ready on port ${envs.port} 🚀`);
}
bootstrap();
