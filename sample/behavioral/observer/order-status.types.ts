/**
 * Ở đây minh họa việc THÔNG BÁO cho nhiều
 * "bên liên quan" khác nhau mỗi khi TRẠNG THÁI đơn hàng thay đổi: gửi email cho
 * khách, trừ/hoàn kho hàng, ghi log audit... Đây là bối cảnh kinh điển của
 * Observer Pattern: 1 sự kiện xảy ra -> nhiều nơi cần được báo tin, mà nơi phát
 * sinh sự kiện (Order) không cần biết chi tiết từng nơi làm gì.
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface OrderStatusChangedEvent {
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  changedAt: Date;
}
