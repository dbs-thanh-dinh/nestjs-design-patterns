/**
 * Chạy thử: npm run sample:adapter
 */
import { LegacyPaymentGatewaySdk } from './external/legacy-payment-gateway.sdk';
import { CheckoutServiceWithoutPattern } from './without-pattern/checkout.without-pattern';
import { PaymentGatewayAdapter } from './with-pattern/payment-gateway.adapter';
import { CheckoutService } from './with-pattern/checkout.service';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN - checkout() hoạt động đúng (có Math.round)');
const withoutPatternService = new CheckoutServiceWithoutPattern();
console.log(withoutPatternService.checkout('ORD-100', 333333, 'card-token-abc'));

line('WITHOUT PATTERN - retryPayment() THẤT BẠI vì logic chuyển đổi bị lặp lại và QUÊN Math.round()');
console.log(withoutPatternService.retryPayment('ORD-100', 333333, 'card-token-abc'));
console.log('=> Đây là ví dụ thật về bug xảy ra khi logic chuyển đổi đơn vị bị copy-paste ở nhiều nơi.');

line('WITH PATTERN (Adapter) - CheckoutService không biết gì về SDK bên thứ 3');
const adapter = new PaymentGatewayAdapter(new LegacyPaymentGatewaySdk());
const checkoutService = new CheckoutService(adapter);

console.log(checkoutService.checkout('ORD-200', 333333, 'card-token-xyz'));
console.log('Gọi lại (mô phỏng retry) - vẫn đúng vì chỉ có 1 nơi định nghĩa logic chuyển đổi:');
console.log(checkoutService.checkout('ORD-200', 333333, 'card-token-xyz'));

line('WITH PATTERN - "đổi cổng thanh toán" chỉ cần 1 adapter/gateway mới');
const fakeStripeLikeGateway = {
  charge: (orderId: string, amountInVnd: number) => ({
    success: true,
    transactionId: `STRIPE-${orderId}-${amountInVnd}`,
  }),
};
const checkoutServiceWithStripe = new CheckoutService(fakeStripeLikeGateway);
console.log(checkoutServiceWithStripe.checkout('ORD-300', 750000, 'card-token-999'));
console.log('=> CheckoutService không đổi 1 dòng code nào cả, chỉ truyền vào 1 IPaymentGateway khác.');

console.log('\nDemo hoàn thành.\n');
