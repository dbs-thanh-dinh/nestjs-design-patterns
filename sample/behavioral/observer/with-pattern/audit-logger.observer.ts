import { Injectable } from '@nestjs/common';
import { OrderStatusChangedEvent } from '../order-status.types';
import { IOrderStatusObserver } from './order-status-observer.interface';

@Injectable()
export class AuditLoggerObserver implements IOrderStatusObserver {
  readonly logs: string[] = [];

  onOrderStatusChanged(event: OrderStatusChangedEvent): void {
    const message = `${event.changedAt.toISOString()} - Đơn hàng ${event.orderId}: ${event.previousStatus} -> ${event.newStatus}`;
    this.logs.push(message);
    // eslint-disable-next-line no-console
    console.log(`[Audit] ${message}`);
  }
}
