import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '../order-payment.types';
import { IPaymentProcessor } from './payment-processor.interface';
import { CreditCardProcessor } from './credit-card.processor';
import { PaypalProcessor } from './paypal.processor';
import { BankTransferProcessor } from './bank-transfer.processor';

/**
 * DÙNG Factory Pattern.
 *
 * Factory chịu trách nhiệm duy nhất: biết cách khởi tạo dùng IPaymentProcessor
 * tương ứng với 1 PaymentMethod.
 *
 * Lợi ích:
 * - Thêm phương thức thanh toán mới (ví dụ MOMO) chỉ cần:
 *    1) Tạo class MomoProcessor implements IPaymentProcessor
 *    2) Đăng ký vào registry bên dưới
 *   -> Không sửa code các processor cũ (tuân thủ Open/Closed).
 * - Từng processor test độc lập, không phụ thuộc lẫn nhau.
 * - Có thể dùng @Injectable() để NestJS tự quản lý vòng đời (nếu cần inject dependency
 *   như HttpService, ConfigService... vào từng processor).
 */
@Injectable()
export class PaymentProcessorFactory {
  private readonly registry: Map<PaymentMethod, IPaymentProcessor>;

  constructor(
    creditCardProcessor: CreditCardProcessor,
    paypalProcessor: PaypalProcessor,
    bankTransferProcessor: BankTransferProcessor,
  ) {
    this.registry = new Map<PaymentMethod, IPaymentProcessor>([
      [creditCardProcessor.method, creditCardProcessor],
      [paypalProcessor.method, paypalProcessor],
      [bankTransferProcessor.method, bankTransferProcessor],
    ]);
  }

  getProcessor(method: PaymentMethod): IPaymentProcessor {
    const processor = this.registry.get(method);
    if (!processor) {
      throw new Error(`Không hỗ trợ phương thức thanh toán: ${method}`);
    }
    return processor;
  }
}
