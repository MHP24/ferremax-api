import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (prefix: string, app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Ferremax API')
    .setDescription('Ferremax API specification')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
};
