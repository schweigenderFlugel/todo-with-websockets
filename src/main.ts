import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
