import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DominioExceptionFilter } from './common/filters/excepciones-dominio.filter';
import { LoggingInterceptor } from './common/interceptores/logging.interceptor';
import { SobreInterceptor } from './common/interceptores/sobre.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new DominioExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new SobreInterceptor(),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: ['http://localhost:5173'],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });

  const config = new DocumentBuilder()
    .setTitle('API del Gimnasio')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documento);

  await app.listen(3000);
}
bootstrap();