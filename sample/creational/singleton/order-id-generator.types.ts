/**
 * Ở đây minh họa bộ sinh mã đơn hàng
 * (Order ID Generator) - nơi rất dễ mắc lỗi nếu có nhiều instance cũng tồn tại
 * song song vì mỗi instance sẽ tự giữ 1 bộ đếm (counter) riêng.
 */
export interface OrderIdSequenceInfo {
  prefix: string;
  currentSequence: number;
}
