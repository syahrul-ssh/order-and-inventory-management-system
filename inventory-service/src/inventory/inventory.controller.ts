import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any) {
    await this.inventoryService.handleOrderCreated(data);
  }
}