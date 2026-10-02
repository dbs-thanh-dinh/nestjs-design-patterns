import { Injectable } from '@nestjs/common';
import { OrderStatus, OrderStatusChangedEvent } from '../order-status.types';
import { IOrderStatusObserver } from './order-status-observer.interface';

@Injectable()
export class InventoryUpdaterObserver implements IOrderStatusObserver {
  readonly actions: string[] = [];

  onOrderStatusChanged(event: OrderStatusChangedEvent): void {
    // Observer này CHỈ quan tâm đến những status liên quan đến kho hàng -
    // nó tự quyết định mình có cần làm gì hay không, không cần OrderStatusPublisher
    // biết trước logic này.
    if (event.newStatus === OrderStatus.CANCELLED) {
      const message = `Hoàn lại tồn kho cho đơn hàng ${event.orderId} vì bị hủy`;
      this.actions.push(message);
      // eslint-disable-next-line no-console
      console.log(`[Inventory] ${message}`);
    } else if (event.newStatus === OrderStatus.CONFIRMED) {
      const message = `Trừ tồn kho cho đơn hàng ${event.orderId} vì đã xác nhận`;
      this.actions.push(message);
      // eslint-disable-next-line no-console
      console.log(`[Inventory] ${message}`);
    }
  }
}
