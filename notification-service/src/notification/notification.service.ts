import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  handleInventoryProcessed(@Payload() payload: any) {
    const { orderId, userId, results } = payload;
    const succeeded = results.filter(r => r.status === 'success');
    const failed = results.filter(r => r.status === 'failed');

    if (failed.length === 0) {
      this.logger.log(`Order successfully processed for user ${userId} (orderId=${orderId}). Items: ${succeeded.length}`);
    } else {
      this.logger.warn(`Order ${orderId} processed with failures for user ${userId}. Success=${succeeded.length}, Failed=${failed.length}`);
    }
  }
}
