import { Injectable } from '@nestjs/common';
import { PaymentMethod, PaymentResult } from '../order-payment.types';
import { IPaymentProcessor } from './payment-processor.interface';

@Injectable()
export class BankTransferProcessor implements IPaymentProcessor {
  readonly method = PaymentMethod.BANK_TRANSFER;

  process(orderId: string, amount: number): PaymentResult {
    const transactionId = `BT-${orderId}-${Date.now()}`;
    return {
      method: this.method,
      amount,
      transactionId,
      message: `Đã ghi nhận chuyển khoản ${amount} cho đơn hàng ${orderId}, chờ đối soát ngân hàng`,
    };
  }
}
