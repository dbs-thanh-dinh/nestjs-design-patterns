import { Injectable } from '@nestjs/common';
import { CheckoutItem, CheckoutResult, CustomerInfo } from '../order-checkout.types';
import { InventorySubsystem } from '../subsystems/inventory.subsystem';
import { PaymentSubsystem } from '../subsystems/payment.subsystem';
import { ShippingSubsystem } from '../subsystems/shipping.subsystem';
import { NotificationSubsystem } from '../subsystems/notification.subsystem';

/**
 * DUNG Facade Pattern.
 *
 * `OrderCheckoutFacade` cũng cấp 1 method DUY NHẤT (`placeOrder`) cho bên ngoài
 * gọi tới. Nó là nơi DUY NHẤT chứa logic diều phối 4 subsystem: đúng thứ tự,
 * dùng logic rollback khi thất bại.
 *
 * Loi ich:
 * - Bất kỳ nơi nào cần checkout (web, admin, mobile app, cron job xử lý đơn
 *   nhập từ file...) chỉ cần gọi `placeOrder()` - KHÔNG cần biết chi tiết bên
 *   trong có bao nhiêu subsystem, thứ tự gọi ra sao.
 * - Logic ROLLBACK (trả lại tồn kho khi thanh toán thất bại) CHỈ TỒN TẠI ở 1
 *   nơi - không thể "quên" ở một nơi gọi nào đó như bản without-pattern.
 * - Muốn đổi thứ tự các bước, hoặc thêm 1 bước mới, chỉ cần sửa DUY NHẤT trong facade - mọi nơi đang gọi
 *   `placeOrder()` tự động được cập nhật theo, không cần sửa từng nơi.
 * - Các subsystem (`InventorySubsystem`, `PaymentSubsystem`...) VẪN GIỮ
 *   NGUYÊN API riêng cũa chúng - Facade không thay thế subsystem, chỉ đơn
 *   giản hóa CÁCH GỌI chung.
 */
@Injectable()
export class OrderCheckoutFacade {
  constructor(
    private readonly inventory: InventorySubsystem,
    private readonly payment: PaymentSubsystem,
    private readonly shipping: ShippingSubsystem,
    private readonly notification: NotificationSubsystem,
  ) {}

  placeOrder(orderId: string, items: CheckoutItem[], customer: CustomerInfo): CheckoutResult {
    const reserved = this.inventory.reserveStock(items);
    if (!reserved) {
      return { success: false, orderId, failedStep: 'inventory', errorMessage: 'Khóng du ton kho' };
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const paymentResult = this.payment.charge(orderId, totalAmount);
    if (!paymentResult.success) {
      // Rollback CHỈ CẦN VIẾT 1 LẦN DUY NHẤT ở đây - mọi nơi gọi placeOrder()
      // đều tự động được hưởng lợi ích này, không thể nào "quên" được nữa.
      this.inventory.releaseStock(items);
      return { success: false, orderId, failedStep: 'payment', errorMessage: paymentResult.errorMessage };
    }

    const shipmentResult = this.shipping.scheduleShipment(orderId, customer.shippingAddress);
    this.notification.sendOrderConfirmation(orderId, customer.email, shipmentResult.trackingCode);

    return {
      success: true,
      orderId,
      transactionId: paymentResult.transactionId,
      trackingCode: shipmentResult.trackingCode,
    };
  }
}
