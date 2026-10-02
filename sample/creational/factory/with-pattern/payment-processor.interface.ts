import { PaymentMethod, PaymentResult } from '../order-payment.types';

export interface IPaymentProcessor {
  readonly method: PaymentMethod;
  process(orderId: string, amount: number): PaymentResult;
}
