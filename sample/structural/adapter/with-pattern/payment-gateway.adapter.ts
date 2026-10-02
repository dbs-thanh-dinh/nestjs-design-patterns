import { Injectable } from '@nestjs/common';
import { IPaymentGateway, PaymentResult } from '../order-payment-gateway.types';
import { LegacyPaymentGatewaySdk } from '../external/legacy-payment-gateway.sdk';

// Ty gia gia dinh: 1 USD = 25.000 VND.
const USD_TO_VND_RATE = 25000;

/**
 * DUNG Adapter Pattern.
 *
 * `PaymentGatewayAdapter` implement interface NỘI BỘ `IPaymentGateway`, nhưng
 * bên trong "bọc" (wrap) `LegacyPaymentGatewaySdk` và chuyển đổi qua lại giữa
 * 2 quy ước: đơn vị VND <-> USD cents, tên field nội bộ <-> tên field cũa SDK.
 *
 * Toàn bộ logic chuyển đổi chỉ tồn tại ở DUY NHẤT 1 nơi - không còn nguy cơ bị
 * lặp lại/thiếu sót như bản without-pattern.
 *
 * Lợi ích:
 * - Code nghiệp vụ (`CheckoutService`) chỉ phụ thuộc vào `IPaymentGateway` -
 *   hoàn toàn không biết đến sự tồn tại cũa `LegacyPaymentGatewaySdk`.
 * - Muốn đổi sang cổng thanh toán khác (ví dụ: Stripe, VNPay) chỉ cần viết 1
 *   Adapter mới implement `IPaymentGateway` - không sửa code nghiệp vụ.
 * - Test được riêng logic chuyển đổi (adapter) tách biệt với logic nghiệp vụ
 *   (checkout flow).
 */
@Injectable()
export class PaymentGatewayAdapter implements IPaymentGateway {
  constructor(private readonly legacyGateway: LegacyPaymentGatewaySdk) {}

  charge(orderId: string, amountInVnd: number, cardToken: string): PaymentResult {
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
}
