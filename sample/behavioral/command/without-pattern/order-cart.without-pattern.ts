import { CartItem } from '../order-cart.types';

/**
 * KHÔNG dùng Command Pattern.
 *
 * Vấn đề:
 * - Mỗi thao tác (thêm sản phẩm, xóa sản phẩm, áp mã giảm giá) là 1 method GỌI
 *   TRỰC TIẾP, không được "gọi lại" thành 1 object nào cả.
 * - Muốn có UNDO, class này buộc phải TỰ GHI NHỚ thứ tự các hành động đã làm
 *   (mảng `actionLog`) VÀ tự viết logic đảo ngược cho TỪNG loại hành động ngay
 *   trong method `undoLast()` bằng switch/if - vi phạm Open/Closed: thêm 1 loại
 *   hành động mới (ví dụ: đổi số lượng sản phẩm) bắt buộc phải sửa cả 2 chỗ
 *   (method thực hiện VÀ nhánh switch trong undoLast).
 * - Logic ghi log hành động bị trộn lẫn với logic nghiệp vụ (thêm/xóa/áp dụng
 *   giảm giá), khó đọc, khó test riêng lẻ.
 * - Không thể dễ dàng "phát lại" (replay), xếp hàng đợi (queue), hay log lại
 *   lịch sử thao tác để audit vì không có 1 định dạng object thống nhất cho
 *   mỗi hành động.
 */
export class OrderCartServiceWithoutPattern {
  readonly items: CartItem[] = [];
  discountPercent = 0;

  // Ghi lại hành động dưới dạng chuỗi + dữ liệu thô -> rất dễ sai nếu quên cập
  // nhật khi thêm loại hành động mới.
  private readonly actionLog: Array<{ type: string; payload: unknown }> = [];

  addItem(item: CartItem): void {
    this.items.push(item);
    this.actionLog.push({ type: 'ADD_ITEM', payload: item });
  }

  removeItem(productName: string): void {
    const index = this.items.findIndex((i) => i.productName === productName);
    if (index === -1) return;
    const [removed] = this.items.splice(index, 1);
    this.actionLog.push({ type: 'REMOVE_ITEM', payload: { item: removed, index } });
  }

  applyDiscount(percent: number): void {
    const previousPercent = this.discountPercent;
    this.discountPercent = percent;
    this.actionLog.push({ type: 'APPLY_DISCOUNT', payload: { previousPercent } });
  }

  undoLast(): void {
    const lastAction = this.actionLog.pop();
    if (!lastAction) return;

    // Phải TỰ ĐOÁN và TỰ VIẾT lại logic đảo ngược cho từng loại hành động -
    // đây chính là phần dễ vô/dễ sót lỗi khi code phình to.
    if (lastAction.type === 'ADD_ITEM') {
      const item = lastAction.payload as CartItem;
      const index = this.items.findIndex((i) => i.productName === item.productName);
      if (index !== -1) this.items.splice(index, 1);
    } else if (lastAction.type === 'REMOVE_ITEM') {
      const { item, index } = lastAction.payload as { item: CartItem; index: number };
      this.items.splice(index, 0, item);
    } else if (lastAction.type === 'APPLY_DISCOUNT') {
      const { previousPercent } = lastAction.payload as { previousPercent: number };
      this.discountPercent = previousPercent;
    }
  }
}
