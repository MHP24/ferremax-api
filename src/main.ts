import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
}
bootstrap();
