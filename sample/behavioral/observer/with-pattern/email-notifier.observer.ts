import { Injectable } from '@nestjs/common';
import { OrderStatusChangedEvent } from '../order-status.types';
import { IOrderStatusObserver } from './order-status-observer.interface';

@Injectable()
export class EmailNotifierObserver implements IOrderStatusObserver {
  // Lưu lại lịch sử để unit test kiểm tra được, thay vì chỉ console.log.
  readonly sentEmails: string[] = [];

  onOrderStatusChanged(event: OrderStatusChangedEvent): void {
    const message = `Gửi email cho khách: đơn hàng ${event.orderId} chuyển từ ${event.previousStatus} sang ${event.newStatus}`;
    this.sentEmails.push(message);
    // eslint-disable-next-line no-console
    console.log(`[Email] ${message}`);
  }
}
