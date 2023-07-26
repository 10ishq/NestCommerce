import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ValidationPipe } from '@nestjs/common';
import {Logger} from 'nestjs-pino'
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
