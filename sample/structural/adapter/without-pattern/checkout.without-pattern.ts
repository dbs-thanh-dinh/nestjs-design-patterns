import { LegacyPaymentGatewaySdk } from '../external/legacy-payment-gateway.sdk';
import { PaymentResult } from '../order-payment-gateway.types';

// Tỷ giá giả định: 1 USD = 25.000 VND (SDK bên thứ 3 chỉ nhận USD cents).
const USD_TO_VND_RATE = 25000;

/**
 * KHÔNG dùng Adapter Pattern.
 *
 * Vấn đề:
 * - Code nghiệp vụ (CheckoutServiceWithoutPattern) PHỤ THUỘC TRỰC TIẾP vào
 *   `LegacyPaymentGatewaySdk` - biết rõ chỉ tiết: đơn vị USD cents, tên field
 *   `referenceCode`/`gatewayRefId`/`status`...
 * - Logic CHUYỂN ĐỔI đơn vị (VND -> USD cents) và ÁNH XẠ field bị LẶP LẠI ở
 *   nhiều nơi gọi thanh toán (ví dụ: `checkout()` và `retryPayment()`) - vi
 *   phạm DRY (Don't Repeat Yourself).
 * - RẤT DỄ XẢY RA BUG khi 1 nơi sửa đúng, nơi kia quên sửa: ở đây
 *   `retryPayment()` QUÊN `Math.round()`, khiến `amountInCents` có thể là SỐ
 *   THẬP PHÂN - SDK bên thứ 3 sẽ từ chối hoặc tính sai số tiền thực thu.
 * - Nếu sau này đổi sang công thanh toán khác, phải sửa TẤT CẢ các nơi đang
 *   gọi trực tiếp `LegacyPaymentGatewaySdk` trong toàn bộ code nghiệp vụ.
 */
export class CheckoutServiceWithoutPattern {
  private readonly legacyGateway = new LegacyPaymentGatewaySdk();

  checkout(orderId: string, amountInVnd: number, cardToken: string): PaymentResult {
    const amountInCents = Math.round((amountInVnd / USD_TO_VND_RATE) * 100);
    const response = this.legacyGateway.makePayment({
      amountInCents,
      cardToken,
      referenceCode: orderId,
    });

    return {
      success: response.status === 'OK',
      transactionId: response.gatewayRefId,
      errorMessage: response.errorMessage,
    };
  }

  retryPayment(orderId: string, amountInVnd: number, cardToken: string): PaymentResult {
    // BUG: quên Math.round() khi copy-paste logic chuyển đổi từ checkout() sang
    // đây - amountInCents có thể là số thập phân (ví dụ 33333.333...).
    const amountInCents = (amountInVnd / USD_TO_VND_RATE) * 100;
    const response = this.legacyGateway.makePayment({
      amountInCents,
      cardToken,
      referenceCode: `${orderId}-RETRY`,
    });

    return {
      success: response.status === 'OK',
      transactionId: response.gatewayRefId,
      errorMessage: response.errorMessage,
    };
  }
}
