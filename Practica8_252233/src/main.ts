import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExcepcionesDominioFilter } from './common/filters/excepciones-dominio.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );
  app.useGlobalFilters(new ExcepcionesDominioFilter());

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });

  await app.listen(3000);
}
bootstrap();