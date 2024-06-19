import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({}); // Ativa o CORS

  app.useGlobalPipes(new ValidationPipe()); // Validador de DTO's

  //app.useGlobalInterceptors(new LogInterceptor()); // Aplica Interceptadores para todos os controllers da API

  await app.listen(3000);
}

bootstrap();
