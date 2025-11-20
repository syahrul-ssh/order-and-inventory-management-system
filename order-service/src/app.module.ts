import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { OrdersModule } from './orders/orders.module';
import { RabbitMQModule } from './rabbitMq/rabbitMq.module';
dotenv.config();

@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 } as any),
    RabbitMQModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: +(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'ordersdb',
      autoLoadEntities: true,
      synchronize: true
    }),
    OrdersModule,
  ],
})
export class AppModule {}
