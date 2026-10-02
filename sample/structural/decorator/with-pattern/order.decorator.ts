import { IPricedOrder } from '../order-pricing.types';

/**
 * DUNG Decorator Pattern.
 *
 * `OrderDecorator` implement CÙNG interface `IPricedOrder` như `BaseOrder`, và
 * giữ 1 tham chiếu đến đối tượng `IPricedOrder` mà nó "bọc" (`wrapped`) - có
 * thể là `BaseOrder` HOẶC 1 decorator KHÁC (cho phép XẾP CHỒNG nhiều lớp).
 *
 * Mặc định, `getDescription()`/`getPrice()` chỉ UY QUYỀN lại cho đối tượng bên
 * trong - mỗi decorator con CHỈ CẦN override và THÊM PHẦN CỦA RIÊNG MÌNH vào
 * kết quả cũa `super`, không cần biết gì về các decorator khác đang bảo quanh
 * hay nằm bên trong nó.
 */
export abstract class OrderDecorator implements IPricedOrder {
  constructor(protected readonly wrapped: IPricedOrder) {}

  getDescription(): string {
    return this.wrapped.getDescription();
  }

  getPrice(): number {
    return this.wrapped.getPrice();
  }
}
