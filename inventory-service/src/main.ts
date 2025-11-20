import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'orders_queue',
      routingKey: 'order.created',
      queueOptions: { durable: true },
    },
  });
  await app.listen();
  console.log('Inventory service is listening to order.created events');
}
bootstrap();
