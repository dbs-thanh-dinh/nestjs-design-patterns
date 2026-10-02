import { CheckoutItem, CheckoutResult, CustomerInfo } from '../order-checkout.types';
import { InventorySubsystem } from '../subsystems/inventory.subsystem';
import { PaymentSubsystem } from '../subsystems/payment.subsystem';
import { ShippingSubsystem } from '../subsystems/shipping.subsystem';
import { NotificationSubsystem } from '../subsystems/notification.subsystem';

/**
 * KHÔNG dùng Facade Pattern.
 *
 * Vấn đề:
 * - Mỗi "nơi gọi checkout" (ở đây mô phỏng 2 nơi: checkout từ web và tạo đơn
 *   thủ công từ trang admin) đều phải TỰ BIẾT và TỰ GỌI DUNG THỨ TỰ ca 4
 *   subsystem: giữ tồn kho -> thu tiền -> lên lịch giao hàng -> gửi email.
 * - Logic ROLLBACK khi 1 bước thất bại (ví dụ: thanh toán thất bại SAU KHI đã
 *   giữ tồn kho -> phải TRẢ LẠI tồn kho) phải được VIẾT LẠI ở TỪNG nơi gọi -
 *   rất dễ bị QUÊN, như hàm `createOrderFromAdmin` bên dưới.
 * - Client code (nơi gọi) phải hiểu chi tiết API cũa CẢ 4 subsystem, thay vì
 *   chỉ cần biết "checkout 1 đơn hàng".
 * - Muốn đổi thứ tự các bước (ví dụ: thu tiền trước khi giữ tồn kho) phải sửa
 *   Ở TẤT CẢ các nơi đang gọi, rất dễ gây không đồng bộ giữa các nơi.
 */
export class WebCheckoutWithoutPattern {
  constructor(
    private readonly inventory: InventorySubsystem,
    private readonly payment: PaymentSubsystem,
    private readonly shipping: ShippingSubsystem,
    private readonly notification: NotificationSubsystem,
  ) {}

  checkoutFromWeb(orderId: string, items: CheckoutItem[], customer: CustomerInfo): CheckoutResult {
    const reserved = this.inventory.reserveStock(items);
    if (!reserved) {
      return { success: false, orderId, failedStep: 'inventory', errorMessage: 'Khóng du ton kho' };
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const paymentResult = this.payment.charge(orderId, totalAmount);
    if (!paymentResult.success) {
      // Co nho rollback ton kho ở đây - nhung phải TU NHO, không co gi bat
      // bước ca.
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

/**
 * Đây là nơi thu 2 cách checkout (ví dụ: nhân viên admin tạo đơn thủ công).
 * Vì không có Facade tập trung logic điều phối, người viết code ở đây đã
 * COPY-PASTE lại gần như toàn bộ logic trên - và QUÊN MẤT bước rollback tồn
 * kho khi thanh toán thất bại!
 */
export class AdminManualOrderWithoutPattern {
  constructor(
    private readonly inventory: InventorySubsystem,
    private readonly payment: PaymentSubsystem,
    private readonly shipping: ShippingSubsystem,
    private readonly notification: NotificationSubsystem,
  ) {}

  createOrderFromAdmin(orderId: string, items: CheckoutItem[], customer: CustomerInfo): CheckoutResult {
    const reserved = this.inventory.reserveStock(items);
    if (!reserved) {
      return { success: false, orderId, failedStep: 'inventory', errorMessage: 'Khóng du ton kho' };
    }

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const paymentResult = this.payment.charge(orderId, totalAmount);
    if (!paymentResult.success) {
      // BUG: QUEN gọi this.inventory.releaseStock(items) ở đây!
      // -> Tồn kho bị "giữ nhầm" vĩnh viễn cho 1 đơn hàng không bao giờ thanh
      // công, dù logic ở WebCheckoutWithoutPattern.checkoutFromWeb() có làm
      // dùng. Đây là hệ quả trực tiếp cũa việc không tập trung logic điều
      // phối vào 1 nơi duy nhất.
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
