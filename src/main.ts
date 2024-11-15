import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );




  app.setGlobalPrefix('api');

  app.use(helmet())
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
