import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('inventory.processed')
  async handleNotification(@Payload() data: any) {
    await this.notificationService.handleInventoryProcessed(data);
  }
}