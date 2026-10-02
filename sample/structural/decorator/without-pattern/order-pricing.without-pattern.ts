/**
 * KHÔNG dùng Decorator Pattern.
 *
 * Vấn đề:
 * - Mỗi dịch vụ tùy chọn (gọi qua, bảo hiểm, giao hỏa tốc) là 1 BOOLEAN FLAG,
 *   và logic tính giá PHẢI KIỂM TRA TỪNG FLAG bằng if/else trong 1 method dùy
 *   nhất -> `calculateTotal()` và `calculateDescription()` phải LUÔN ĐỒNG BỘ
 *   với nhau (thêm 1 dòng ở chỗ này thi phải nhớ thêm ở chỗ kia).
 * - Thêm 1 dịch vụ tùy chọn mới (ví dụ: "bọc chống sóc") BẮT BUỘC phải SỬA cả
 *   2 method này - vì phạm Open/Closed.
 * - THỨ TỰ áp dụng các dịch vụ la CỐ ĐỊNH (luôn giftWrap -> insurance ->
 *   expressHandling) - không thể tùy biến thu tu cho từng đơn hàng cũ the, dù
 *   trong thực tế thu tu có thể ẢNH HƯỞNG ĐẾN KẾT QUẢ (ví dụ: bảo hiểm tinh %
 *   trên giá đã bao gồm phí gọi qua hay chưa).
 * - Số lượng TỔ HỢP có thể có tăng theo CẤP SỐ NHÂN (2^n với n dịch vụ tùy
 *   chọn) - với 3 dịch vụ đã có 8 tổ hợp cần nghĩ đến khi test/debug, chỉ cần
 *   thêm 1 dịch vụ nữa là 16.
 */
export interface OrderPricingOptions {
  giftWrap?: boolean;
  insurance?: boolean;
  expressHandling?: boolean;
}

const GIFT_WRAP_FEE = 20000;
const INSURANCE_RATE = 0.02;
const EXPRESS_HANDLING_FEE = 50000;

export class OrderPricingServiceWithoutPattern {
  calculateTotal(basePrice: number, options: OrderPricingOptions): number {
    let total = basePrice;
    if (options.giftWrap) {
      total += GIFT_WRAP_FEE;
    }
    if (options.insurance) {
      total *= 1 + INSURANCE_RATE;
    }
    if (options.expressHandling) {
      total += EXPRESS_HANDLING_FEE;
    }
    return Math.round(total);
  }

  calculateDescription(orderId: string, options: OrderPricingOptions): string {
    let description = `Don hang ${orderId}`;
    if (options.giftWrap) {
      description += ' + Goi qua';
    }
    if (options.insurance) {
      description += ' + Bao hiem van chuyen';
    }
    if (options.expressHandling) {
      description += ' + Giao hoa toc';
    }
    return description;
  }
}
