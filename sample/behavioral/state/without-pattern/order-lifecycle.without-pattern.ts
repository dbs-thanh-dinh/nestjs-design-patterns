import { OrderStatus } from '../order-lifecycle.types';

/**
 * KHÔNG dùng State Pattern.
 *
 * Vấn đề:
 * - Mỗi hành động (`confirm`, `ship`, `deliver`, `cancel`) đều phải TỰ KIỂM TRA
 *   trạng thái hiện tại bằng if/else -> quy tắc chuyển trạng thái bị RẢI RÁC
 *   khắp 4 method khác nhau thay vì tập trung theo TỪNG TRẠNG THÁI.
 * - Khi số trạng thái và hành động tăng lên, số nhánh điều kiện tăng theo cấp số
 *   nhân (mỗi hành động x mỗi trạng thái) -> code ngày càng rối, dễ sót trường
 *   hợp, dễ quên cập nhật khi thêm 1 trạng thái mới.
 * - Muốn biết "ở trạng thái X thì làm được những gì" phải đọc cả 4 method và
 *   lọc ra từng nhánh liên quan, thay vì chỉ cần mở 1 class đại diện cho trạng
 *   thái đó.
 */
export class OrderLifecycleServiceWithoutPattern {
  private status: OrderStatus = OrderStatus.PENDING;

  getStatus(): OrderStatus {
    return this.status;
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(`Không thể thực hiện "confirm" khi đơn hàng đang ở trạng thái ${this.status}`);
    }
    this.status = OrderStatus.CONFIRMED;
  }

  ship(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new Error(`Không thể thực hiện "ship" khi đơn hàng đang ở trạng thái ${this.status}`);
    }
    this.status = OrderStatus.SHIPPED;
  }

  deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new Error(`Không thể thực hiện "deliver" khi đơn hàng đang ở trạng thái ${this.status}`);
    }
    this.status = OrderStatus.DELIVERED;
  }

  cancel(): void {
    // Logic hủy đơn lại càng phức tạp hơn: chỉ hủy được ở 2 trạng thái đầu.
    if (this.status !== OrderStatus.PENDING && this.status !== OrderStatus.CONFIRMED) {
      throw new Error(`Không thể thực hiện "cancel" khi đơn hàng đang ở trạng thái ${this.status}`);
    }
    this.status = OrderStatus.CANCELLED;
  }
}
