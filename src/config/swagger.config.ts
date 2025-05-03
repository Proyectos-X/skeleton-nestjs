import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const title = 'Skeleton Next';
const description = 'Test by zevaguillo';
/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(apiVersion)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`api/${apiVersion}/swagger`, app, document);
};
