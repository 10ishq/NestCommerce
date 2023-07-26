import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { OrderDocument, OrderSchema } from './models/order.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/constants';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([
    {
      name: OrderDocument.name,
      schema: OrderSchema
    }
  ]),
  LoggerModule,
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required(),
      // PORT: Joi.number().required(),
      // AUTH_HOST: Joi.string().required(),
      // PAYMENTS_HOST: Joi.string().required(),
      // AUTH_PORT: Joi.number().required(),
      // PAYMENTS_PORT: Joi.number().required(),
    }),
  }),
  ClientsModule.registerAsync([
    {
      name: AUTH_SERVICE,
      useFactory: () => ({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'auth',
        }
      }),
      inject: [ConfigService]
    }
  ]),
],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository]
})
export class OrdersModule {}
