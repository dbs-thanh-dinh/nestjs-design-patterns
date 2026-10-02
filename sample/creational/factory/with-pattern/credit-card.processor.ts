import { Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentResult } from '../order-payment.types';
import { IPaymentProcessor } from './payment-processor.interface';

@Injectable()
export class CreditCardProcessor implements IPaymentProcessor {
  readonly method = PaymentMethod.CREDIT_CARD;

  process(orderId: string, amount: number): PaymentResult {
    const transactionId = `CC-${orderId}-${Date.now()}`;
    return {
      method: this.method,
      amount,
      transactionId,
      message: `Đã trừ ${amount} qua thẻ tín dùng cho đơn hàng ${orderId}`,
    };
  }
}
