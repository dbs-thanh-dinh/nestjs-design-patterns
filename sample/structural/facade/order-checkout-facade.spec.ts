import { InventorySubsystem } from './subsystems/inventory.subsystem';
import { PaymentSubsystem } from './subsystems/payment.subsystem';
import { ShippingSubsystem } from './subsystems/shipping.subsystem';
import { NotificationSubsystem } from './subsystems/notification.subsystem';
import { WebCheckoutWithoutPattern, AdminManualOrderWithoutPattern } from './without-pattern/checkout.without-pattern';
import { OrderCheckoutFacade } from './with-pattern/order-checkout.facade';

function createSubsystems() {
  return {
    inventory: new InventorySubsystem(),
    payment: new PaymentSubsystem(),
    shipping: new ShippingSubsystem(),
    notification: new NotificationSubsystem(),
  };
}

const customer = { email: 'khach@example.com', shippingAddress: '123 Le Loi, HCM' };

describe('Facade Pattern - Order Checkout', () => {
  describe('Without Pattern', () => {
    it('WebCheckoutWithoutPattern rollback DUNG ton kho khi thanh toán thất bại', () => {
      const { inventory, payment, shipping, notification } = createSubsystems();
      const webCheckout = new WebCheckoutWithoutPattern(inventory, payment, shipping, notification);

      const availableBefore = inventory.getAvailableQuantity('Ao thun');
      // 10 ao thun x 600.000 = 6.000.000 -> vuot han muc 5.000.000, payment thất bại
      const result = webCheckout.checkoutFromWeb(
        'ORD-1',
        [{ productName: 'Ao thun', quantity: 10, unitPrice: 600000 }],
        customer,
      );

      expect(result.success).toBe(false);
      expect(result.failedStep).toBe('payment');
      // Ton kho được TRẢ LẠI dùng vì nơi này co nho rollback.
      expect(inventory.getAvailableQuantity('Ao thun')).toBe(availableBefore);
    });

    it('AdminManualOrderWithoutPattern LAM MAT ton kho khi thanh toán thất bại (bug do QUEN rollback)', () => {
      const { inventory, payment, shipping, notification } = createSubsystems();
      const adminOrder = new AdminManualOrderWithoutPattern(inventory, payment, shipping, notification);

      const availableBefore = inventory.getAvailableQuantity('Ao thun');
      const result = adminOrder.createOrderFromAdmin(
        'ORD-2',
        [{ productName: 'Ao thun', quantity: 10, unitPrice: 600000 }],
        customer,
      );

      expect(result.success).toBe(false);
      expect(result.failedStep).toBe('payment');
      // BUG: ton kho KHONG được tra lai - day chỉnh la he qua cũa viec logic
      // rollback bi thieu sot o nơi gọi này.
      expect(inventory.getAvailableQuantity('Ao thun')).toBe(availableBefore - 10);
      expect(inventory.getAvailableQuantity('Ao thun')).not.toBe(availableBefore);
    });
  });

  describe('With Pattern (Facade)', () => {
    it('placeOrder() thanh cong sẽ giữ tồn kho, thu tiền, lên lịch giao hang và gửi email', () => {
      const { inventory, payment, shipping, notification } = createSubsystems();
      const facade = new OrderCheckoutFacade(inventory, payment, shipping, notification);

      const result = facade.placeOrder(
        'ORD-3',
        [{ productName: 'Quan jean', quantity: 2, unitPrice: 450000 }],
        customer,
      );

      expect(result.success).toBe(true);
      expect(result.transactionId).toContain('PAY-ORD-3-');
      expect(result.trackingCode).toContain('SHIP-ORD-3-');
      expect(inventory.getAvailableQuantity('Quan jean')).toBe(3); // 5 - 2
      expect(notification.sentEmails).toHaveLength(1);
    });

    it('placeOrder() thất bại o bước inventory sẽ KHONG thu tiền/giao hang/gui mail', () => {
      const { inventory, payment, shipping, notification } = createSubsystems();
      const facade = new OrderCheckoutFacade(inventory, payment, shipping, notification);

      const result = facade.placeOrder(
        'ORD-4',
        [{ productName: 'Ao khoac', quantity: 1, unitPrice: 600000 }], // het hang
        customer,
      );

      expect(result.success).toBe(false);
      expect(result.failedStep).toBe('inventory');
      expect(notification.sentEmails).toHaveLength(0);
    });

    it('placeOrder() thất bại o bước payment sẽ TU DONG rollback ton kho - không the "quen" nhu ban without-pattern', () => {
      const { inventory, payment, shipping, notification } = createSubsystems();
      const facade = new OrderCheckoutFacade(inventory, payment, shipping, notification);

      const availableBefore = inventory.getAvailableQuantity('Ao thun');
      const result = facade.placeOrder(
        'ORD-5',
        [{ productName: 'Ao thun', quantity: 10, unitPrice: 600000 }], // 6.000.000 -> vuot han muc
        customer,
      );

      expect(result.success).toBe(false);
      expect(result.failedStep).toBe('payment');
      expect(inventory.getAvailableQuantity('Ao thun')).toBe(availableBefore); // luon dùng, moi lần gọi
      expect(notification.sentEmails).toHaveLength(0);
    });

    it('nguoi gọi facade không can biet gi ve chỉ tiet cũa 4 subsystem ben dưới', () => {
      const { inventory, payment, shipping, notification } = createSubsystems();
      const facade = new OrderCheckoutFacade(inventory, payment, shipping, notification);

      // Chi can 1 lỗi gọi duy nhất, không can tu dieu phoi thu tu gọi các
      // subsystem hay tu viet logic rollback.
      const result = facade.placeOrder(
        'ORD-6',
        [{ productName: 'Quan jean', quantity: 1, unitPrice: 450000 }],
        customer,
      );

      expect(result.success).toBe(true);
    });
  });
});
