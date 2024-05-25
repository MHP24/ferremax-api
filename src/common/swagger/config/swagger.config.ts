import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (prefix: string, app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Ferremax API')
    .setDescription(
      'Ferremax API, manage your orders, authentication, products, and shopping cart efficiently and quickly at your trusted hardware store.',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
};
