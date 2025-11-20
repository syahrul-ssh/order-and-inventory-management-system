import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepo: Repository<OrderDetail>, 
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy
  ) { }

  async createOrder(dto: CreateOrderDto) {
    const order = await this.createOrderWithDetails(dto.userId, dto.items);

    const event = {
      orderId: order.orderId,
      userId: order.userId,
      items: order.details.map(d => ({ itemId: d.itemId, quantity: d.quantity })),
      createdAt: order.createdAt
    };

    // emit single event containing all items
    this.client.emit('order.created', event);

    return { success: true, data: event, message: 'Order created successfully and is being processed' };
  }

  async createOrderWithDetails(userId: number, items: { itemId: number, quantity: number }[]) {
    const order = this.orderRepo.create({
      orderId: `order-${Date.now()}`,
      userId,
      createdAt: new Date(),
      details: items.map(i => this.orderDetailRepo.create({ itemId: i.itemId, quantity: i.quantity }))
    });
    return await this.orderRepo.save(order);
  }
}
