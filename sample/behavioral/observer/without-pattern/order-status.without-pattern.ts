import { OrderStatus, OrderStatusChangedEvent } from '../order-status.types';

/**
 * KHÔNG dùng Observer Pattern.
 *
 * Vấn đề:
 * - `OrderStatusServiceWithoutPattern` phải TỰ BIẾT và TỰ GỌI TRỰC TIẾP tới từng
 *   nơi cần được thông báo (email, kho hàng, audit log...) - vi phạm Single
 *   Responsibility (1 class làm quá nhiều việc không liên quan đến nhau).
 * - Thêm 1 "bên liên quan" mới (ví dụ: gửi thông báo qua app mobile) BẮT BUỘC
 *   phải SỬA trực tiếp vào method `updateStatus()` -> vi phạm Open/Closed.
 * - Muốn tắt 1 thông báo nào đó (ví dụ: tạm thời tắt audit log để debug) cũng
 *   phải sửa code, không thể "tắt/bật" linh hoạt lúc runtime.
 * - Rất khó unit test riêng lẻ logic gửi email / cập nhật kho / ghi log vì tất
 *   cả đều bị trộn chung trong 1 method.
 */
export class OrderStatusServiceWithoutPattern {
  updateStatus(orderId: string, previousStatus: OrderStatus, newStatus: OrderStatus): OrderStatusChangedEvent {
    const event: OrderStatusChangedEvent = {
      orderId,
      previousStatus,
      newStatus,
      changedAt: new Date(),
    };

    // Gọi cùng từng nơi một cách thủ công - OrderStatusService phải "biết hết"
    // logic của email, kho hàng, audit log.
    this.sendEmailNotification(event);
    this.updateInventory(event);
    this.writeAuditLog(event);

    return event;
  }

  private sendEmailNotification(event: OrderStatusChangedEvent): void {
    // eslint-disable-next-line no-console
    console.log(
      `[Email] Gửi email cho khách: đơn hàng ${event.orderId} chuyển từ ${event.previousStatus} sang ${event.newStatus}`,
    );
  }

  private updateInventory(event: OrderStatusChangedEvent): void {
    if (event.newStatus === OrderStatus.CANCELLED) {
      // eslint-disable-next-line no-console
      console.log(`[Inventory] Hoàn lại tồn kho cho đơn hàng ${event.orderId} vì bị hủy`);
    } else if (event.newStatus === OrderStatus.CONFIRMED) {
      // eslint-disable-next-line no-console
      console.log(`[Inventory] Trừ tồn kho cho đơn hàng ${event.orderId} vì đã xác nhận`);
    }
  }

  private writeAuditLog(event: OrderStatusChangedEvent): void {
    // eslint-disable-next-line no-console
    console.log(
      `[Audit] ${event.changedAt.toISOString()} - Đơn hàng ${event.orderId}: ${event.previousStatus} -> ${event.newStatus}`,
    );
  }
}
