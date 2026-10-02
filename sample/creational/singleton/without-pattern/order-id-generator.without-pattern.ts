import { OrderIdSequenceInfo } from '../order-id-generator.types';

/**
 * KHÔNG dùng Singleton Pattern.
 *
 * Vấn đề:
 * - Class này có thể bị `new` ở nhiều nơi khác nhau trong code (ví dụ: 1 lần trong
 *   OrderService, 1 lần trong ImportService khi import đơn hàng từ file Excel...).
 * - Mỗi instance từ giữ 1 bộ đếm `sequence` RIÊNG, không biết gi về các instance khác.
 * - Hệ quả: có thể sinh ra 2 Order ID TRÙNG NHAU dù cả 2 cũng chạy trong 1 ứng dụng,
 *   vì mỗi instance đều bắt đầu đếm từ 0.
 */
export class OrderIdGeneratorWithoutPattern {
  private prefix = 'ORD';
  private sequence = 0;

  generate(): string {
    this.sequence += 1;
    const paddedSequence = String(this.sequence).padStart(6, '0');
    return `${this.prefix}-${paddedSequence}`;
  }

  getInfo(): OrderIdSequenceInfo {
    return { prefix: this.prefix, currentSequence: this.sequence };
  }
}
