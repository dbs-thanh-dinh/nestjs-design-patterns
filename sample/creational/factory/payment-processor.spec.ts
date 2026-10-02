import { PaymentMethod } from './order-payment.types';
import { OrderPaymentServiceWithoutPattern } from './without-pattern/payment-processor.without-pattern';
import { PaymentProcessorFactory } from './with-pattern/payment-processor.factory';
import { CreditCardProcessor } from './with-pattern/credit-card.processor';
import { PaypalProcessor } from './with-pattern/paypal.processor';
import { BankTransferProcessor } from './with-pattern/bank-transfer.processor';

describe('Factory Pattern - Order Payment', () => {
  describe('Without Pattern', () => {
    const service = new OrderPaymentServiceWithoutPattern();

    it('xử lý thanh toán credit card', () => {
      const result = service.processPayment(PaymentMethod.CREDIT_CARD, 'ORD-1', 100);
      expect(result.method).toBe(PaymentMethod.CREDIT_CARD);
      expect(result.amount).toBe(100);
      expect(result.transactionId).toMatch(/^CC-ORD-1-/);
    });

    it('ném lỗi khi phương thức không tồn tại', () => {
      expect(() =>
        service.processPayment('MOMO' as PaymentMethod, 'ORD-1', 100),
      ).toThrow('Không hỗ trợ phương thức thanh toán: MOMO');
    });
  });

  describe('With Pattern (Factory)', () => {
    const factory = new PaymentProcessorFactory(
      new CreditCardProcessor(),
      new PaypalProcessor(),
      new BankTransferProcessor(),
    );

    it.each([
      [PaymentMethod.CREDIT_CARD, /^CC-/],
      [PaymentMethod.PAYPAL, /^PP-/],
      [PaymentMethod.BANK_TRANSFER, /^BT-/],
    ])('factory trả về đúng processor cho %s', (method, prefixPattern) => {
      const processor = factory.getProcessor(method);
      const result = processor.process('ORD-2', 250);

      expect(processor.method).toBe(method);
      expect(result.amount).toBe(250);
      expect(result.transactionId).toMatch(prefixPattern);
    });

    it('ném lỗi khi phương thức không được đăng ký trong factory', () => {
      expect(() => factory.getProcessor('MOMO' as PaymentMethod)).toThrow(
        'Không hỗ trợ phương thức thanh toán: MOMO',
      );
    });
  });
});
