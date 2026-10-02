import { PaymentMethod, PaymentResult } from '../order-payment.types';

/**
 * KHÔNG dùng Factory Pattern.
 *
 * Vấn đề:
 * - Toàn bộ logic tạo/xử lý payment processor nằm trong 1 method duy nhất.
 * - Mỗi khi thêm 1 phương thức thanh toán mới (ví dụ: MOMO, VNPAY...) phải SỬA
 *   trực tiếp vào method này -> vi phạm nguyên tắc Open/Closed (OCP).
 * - Khó test riêng lẻ từng phương thức thanh toán vì logic bị trộn vào nhau.
 * - Khó tái sử dụng logic xử lý credit card / paypal / bank transfer ở nơi khác.
 */
export class OrderPaymentServiceWithoutPattern {
  processPayment(method: PaymentMethod, orderId: string, amount: number): PaymentResult {
    if (method === PaymentMethod.CREDIT_CARD) {
      // logic riêng cho credit card
      const transactionId = `CC-${orderId}-${Date.now()}`;
      return {
        method,
        amount,
        transactionId,
        message: `Đã trừ ${amount} qua thẻ tín dụng cho đơn hàng ${orderId}`,
      };
    } else if (method === PaymentMethod.PAYPAL) {
      // logic riêng cho paypal
      const transactionId = `PP-${orderId}-${Date.now()}`;
      return {
        method,
        amount,
        transactionId,
        message: `Đã thanh toán ${amount} qua PayPal cho đơn hàng ${orderId}`,
      };
    } else if (method === PaymentMethod.BANK_TRANSFER) {
      // logic riêng cho bank transfer
      const transactionId = `BT-${orderId}-${Date.now()}`;
      return {
        method,
        amount,
        transactionId,
        message: `Đã ghi nhận chuyển khoản ${amount} cho đơn hàng ${orderId}, chờ đối soát ngân hàng`,
      };
    }

    // Thêm 1 phương thức thanh toán mới -> BẮT BUỘC phải sửa hàm này,
    // rất dễ gây lỗi cho các nhánh else if cũ.
    throw new Error(`Không hỗ trợ phương thức thanh toán: ${method}`);
  }
}
