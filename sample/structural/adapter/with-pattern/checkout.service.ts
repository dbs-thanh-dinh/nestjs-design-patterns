import { Injectable } from '@nestjs/common';
import { IPaymentGateway, PaymentResult } from '../order-payment-gateway.types';

/**
 * `CheckoutService` là code NGHIỆP VỤ thuần túy - chỉ làm việc với interface
 * `IPaymentGateway`, hoàn toàn không biết bên dưới đang dùng
 * `LegacyPaymentGatewaySdk` hay bất kỳ cổng thanh toán nào khác.
 *
 * ưu ý khi wiring qua NestJS DI thực tế: vì `IPaymentGateway` là 1 interface
 * (không tồn tại lúc runtime sau khi biến dich), KHÔNG THỂ `@Inject(IPaymentGateway)`
 * trực tiếp. Cần định nghĩa 1 DI token riêng, ví dụ:
 *
 *   export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');
 *   trong module: { provide: PAYMENT_GATEWAY, useClass: PaymentGatewayAdapter }
 *   trong service: constructor(@Inject(PAYMENT_GATEWAY) private gateway: IPaymentGateway) {}
 *
 * Trong sample/demo/test này, ta truyền adapter trực tiếp qua constructor
 * (không qua Nest DI container) để giữ ví dụ đơn giản, tập trung vào bản chất
 * của Adapter Pattern.
 */
@Injectable()
export class CheckoutService {
  constructor(private readonly paymentGateway: IPaymentGateway) {}

  checkout(orderId: string, amountInVnd: number, cardToken: string): PaymentResult {
    return this.paymentGateway.charge(orderId, amountInVnd, cardToken);
  }
}
