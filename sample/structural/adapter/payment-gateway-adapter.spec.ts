import { LegacyPaymentGatewaySdk } from './external/legacy-payment-gateway.sdk';
import { CheckoutServiceWithoutPattern } from './without-pattern/checkout.without-pattern';
import { PaymentGatewayAdapter } from './with-pattern/payment-gateway.adapter';
import { CheckoutService } from './with-pattern/checkout.service';

describe('Adapter Pattern - Legacy Payment Gateway Integration', () => {
  describe('Without Pattern', () => {
    it('checkout() hoat dòng dùng vì co Math.round()', () => {
      const service = new CheckoutServiceWithoutPattern();
      const result = service.checkout('ORD-1', 333333, 'card-token-123');

      expect(result.success).toBe(true);
      expect(result.transactionId).toContain('LEGACY-ORD-1-');
    });

    it('retryPayment() có thể THAT BAI vì QUEN Math.round() -> amountInCents la so thap phan', () => {
      const service = new CheckoutServiceWithoutPattern();
      // 333333 VND / 25000 * 100 = 1333.332 -> không phải so nguyen!
      const result = service.retryPayment('ORD-2', 333333, 'card-token-123');

      // Day chính la HE QUA cũa viec logic chuyen doi bi lap lai và thieu sot:
      // SDK ben thu 3 tu choi vì amountInCents không phải so nguyen.
      expect(result.success).toBe(false);
      expect(result.errorMessage).toContain('amountInCents không hợp lệ');
    });
  });

  describe('With Pattern (Adapter)', () => {
    it('adapter chuyen doi dùng VND -> USD cents (luon co Math.round, chỉ dinh nghia 1 lần)', () => {
      const adapter = new PaymentGatewayAdapter(new LegacyPaymentGatewaySdk());
      const result = adapter.charge('ORD-3', 333333, 'card-token-123');

      expect(result.success).toBe(true);
      expect(result.transactionId).toContain('LEGACY-ORD-3-');
    });

    it('adapter tra ve success=false và truyen dùng errorMessage khi thieu cardToken', () => {
      const adapter = new PaymentGatewayAdapter(new LegacyPaymentGatewaySdk());
      const result = adapter.charge('ORD-4', 100000, '');

      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('Thiếu cardToken');
    });

    it('CheckoutService chỉ phu thuoc vào IPaymentGateway, không biet gi ve SDK ben thu 3', () => {
      const adapter = new PaymentGatewayAdapter(new LegacyPaymentGatewaySdk());
      const checkoutService = new CheckoutService(adapter);

      const result = checkoutService.checkout('ORD-5', 500000, 'card-token-456');

      expect(result.success).toBe(true);
      expect(result.transactionId).toContain('LEGACY-ORD-5-');
    });

    it('gọi charge() nhieu lần lien tiep (mo phong retry) van chuyen doi dùng, không bi bug nhu ban without-pattern', () => {
      const adapter = new PaymentGatewayAdapter(new LegacyPaymentGatewaySdk());

      const firstAttempt = adapter.charge('ORD-6', 333333, 'card-token-789');
      const retryAttempt = adapter.charge('ORD-6', 333333, 'card-token-789');

      // Vi logic chuyen doi chỉ dinh nghia DUY NHAT 1 lần trong adapter, ca 2
      // lần gọi deu dùng Math.round() - không the "quen" nhu ham retryPayment()
      // cũa ban without-pattern.
      expect(firstAttempt.success).toBe(true);
      expect(retryAttempt.success).toBe(true);
    });

    it('doi sang 1 cong thanh toán khac chỉ can 1 adapter moi, không sua CheckoutService', () => {
      // Gia lap "cong thanh toán khac" bang 1 IPaymentGateway implementation
      // inline, không dòng den CheckoutService hay PaymentGatewayAdapter.
      const fakeStripeLikeGateway = {
        charge: (orderId: string, amountInVnd: number) => ({
          success: true,
          transactionId: `STRIPE-${orderId}-${amountInVnd}`,
        }),
      };

      const checkoutService = new CheckoutService(fakeStripeLikeGateway);
      const result = checkoutService.checkout('ORD-7', 200000, 'card-token-999');

      expect(result.transactionId).toBe('STRIPE-ORD-7-200000');
    });
  });
});
