import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/http';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(AppModule.apiPrefix);
  SwaggerConfig(app, AppModule.apiVersion);

  await app.listen(AppModule.port ?? 3000);
}
bootstrap();
