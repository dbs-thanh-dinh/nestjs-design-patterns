/**
 * Ở đây minh họa VÒNG ĐỜI (lifecycle) của
 * đơn hàng: các HÀNH ĐỘNG được phép thực hiện (confirm/ship/deliver/cancel) và
 * TRẠNG THÁI KẾ TIẾP sẽ hoàn toàn khác nhau tùy vào trạng thái HIỆN TẠI của đơn
 * hàng. Đây là bối cảnh kinh điển của State Pattern.
 *
 * Lưu ý trạng thái hợp lệ:
 *   PENDING --confirm--> CONFIRMED --ship--> SHIPPED --deliver--> DELIVERED
 *   PENDING --cancel--> CANCELLED
 *   CONFIRMED --cancel--> CANCELLED
 *   (SHIPPED và DELIVERED KHÔNG thể hủy; DELIVERED/CANCELLED là trạng thái cuối)
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
