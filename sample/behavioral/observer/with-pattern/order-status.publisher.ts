import { Injectable } from '@nestjs/common';
import { OrderStatus, OrderStatusChangedEvent } from '../order-status.types';
import { IOrderStatusObserver } from './order-status-observer.interface';

/**
 * DÙNG Observer Pattern.
 *
 * `OrderStatusPublisher` (subject) chỉ làm 2 việc:
 * 1) Quản lý danh sách observer đang "đăng ký lắng nghe" (subscribe/unsubscribe).
 * 2) Khi trạng thái đơn hàng thay đổi, phát (notify) sự kiện tới TẤT CẢ observer.
 *
 * Nó hoàn toàn KHÔNG BIẾT từng observer làm gì bên trong (gửi email, trừ kho,
 * ghi log...) - đó là trách nhiệm riêng của từng observer.
 *
 * Lợi ích:
 * - Thêm 1 "bên liên quan" mới (ví dụ push notification app mobile) chỉ cần tạo
 *   1 class mới implement IOrderStatusObserver rồi `subscribe()` vào publisher -
 *   KHÔNG sửa code publisher hay các observer khác.
 * - Có thể `unsubscribe()` 1 observer bất kỳ lúc runtime (ví dụ: tạm tắt audit
 *   log khi đang debug) mà không ảnh hưởng các observer còn lại.
 * - Từng observer test độc lập hoàn toàn, không phụ thuộc observer khác.
 */
@Injectable()
export class OrderStatusPublisher {
  private readonly observers: Set<IOrderStatusObserver> = new Set();

  subscribe(observer: IOrderStatusObserver): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: IOrderStatusObserver): void {
    this.observers.delete(observer);
  }

  updateStatus(orderId: string, previousStatus: OrderStatus, newStatus: OrderStatus): OrderStatusChangedEvent {
    const event: OrderStatusChangedEvent = {
      orderId,
      previousStatus,
      newStatus,
      changedAt: new Date(),
    };

    for (const observer of this.observers) {
      observer.onOrderStatusChanged(event);
    }

    return event;
  }
}
