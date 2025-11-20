import { Injectable, Logger } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private notifyClient = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'notifications_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  constructor(@InjectRepository(Inventory) private repo: Repository<Inventory>) {}

  async handleOrderCreated(data: any) {
    console.log('Received order.created event');
    const { orderId, userId, items } = data;
    const results: any = [];

    for (const it of items) {
      const { itemId, quantity } = it;
      const item = await this.repo.findOneBy({ id: itemId });

      if (!item) {
        results.push({
          id: itemId,
          name: '-',
          quantity,
          status: 'failed',
          reason: 'item_not_found',
        });
        continue;
      }

      if (item.stock >= quantity) {
        item.stock -= quantity;
        await this.repo.save(item);
        results.push({
          id: itemId,
          name: item.name,
          quantity,
          status: 'success',
          remaining: item.stock,
        });
      } else {
        results.push({
          id: itemId,
          name: item.name,
          quantity,
          status: 'failed',
          reason: 'insufficient_stock',
          available: item.stock,
        });
      }
    }

    this.notifyClient.emit('inventory.processed', { orderId, userId, results });
    this.logger.log(`Processed order ${orderId}: ${JSON.stringify(results)}`);
  }
}