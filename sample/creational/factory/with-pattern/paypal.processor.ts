import { Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentResult } from '../order-payment.types';
import { IPaymentProcessor } from './payment-processor.interface';

@Injectable()
export class PaypalProcessor implements IPaymentProcessor {
  readonly method = PaymentMethod.PAYPAL;

  process(orderId: string, amount: number): PaymentResult {
    const transactionId = `PP-${orderId}-${Date.now()}`;
    return {
      method: this.method,
      amount,
      transactionId,
      message: `Đã thanh toán ${amount} qua PayPal cho đơn hàng ${orderId}`,
    };
  }
}
