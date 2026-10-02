/**
 * Chạy thử: npm run sample:factory
 *
 * Script này không bootstrap HTTP server của Nest - chỉ khởi tạo trực tiếp
 * các class bằng tay để demo nhanh sự khác biệt giữa 2 cách làm.
 */
import { PaymentMethod } from './order-payment.types';
import { OrderPaymentServiceWithoutPattern } from './without-pattern/payment-processor.without-pattern';
import { PaymentProcessorFactory } from './with-pattern/payment-processor.factory';
import { CreditCardProcessor } from './with-pattern/credit-card.processor';
import { PaypalProcessor } from './with-pattern/paypal.processor';
import { BankTransferProcessor } from './with-pattern/bank-transfer.processor';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN');
const withoutPatternService = new OrderPaymentServiceWithoutPattern();
console.log(withoutPatternService.processPayment(PaymentMethod.CREDIT_CARD, 'ORD-100', 500));
console.log(withoutPatternService.processPayment(PaymentMethod.PAYPAL, 'ORD-101', 250));

line('WITH PATTERN (Factory)');
const factory = new PaymentProcessorFactory(
  new CreditCardProcessor(),
  new PaypalProcessor(),
  new BankTransferProcessor(),
);

for (const method of Object.values(PaymentMethod)) {
  const processor = factory.getProcessor(method);
  console.log(processor.process('ORD-200', 999));
}

console.log('\nDemo hoàn tất.\n');
