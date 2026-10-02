import { OrderStatus } from './order-status.types';
import { OrderStatusServiceWithoutPattern } from './without-pattern/order-status.without-pattern';
import { OrderStatusPublisher } from './with-pattern/order-status.publisher';
import { EmailNotifierObserver } from './with-pattern/email-notifier.observer';
import { InventoryUpdaterObserver } from './with-pattern/inventory-updater.observer';
import { AuditLoggerObserver } from './with-pattern/audit-logger.observer';

describe('Observer Pattern - Order Status Change', () => {
  describe('Without Pattern', () => {
    it('cập nhật trạng thái vẫn chạy, nhưng logic thông báo bị trộn hết vào 1 method', () => {
      const service = new OrderStatusServiceWithoutPattern();
      const event = service.updateStatus('ORD-1', OrderStatus.PENDING, OrderStatus.CONFIRMED);

      expect(event.orderId).toBe('ORD-1');
      expect(event.newStatus).toBe(OrderStatus.CONFIRMED);
      // Không có cách nào "tắt" riêng 1 thông báo (ví dụ email) mà không sửa code.
    });
  });

  describe('With Pattern (Observer)', () => {
    it('tất cả observer đã subscribe đều được thông báo khi trạng thái thay đổi', () => {
      const publisher = new OrderStatusPublisher();
      const emailObserver = new EmailNotifierObserver();
      const inventoryObserver = new InventoryUpdaterObserver();
      const auditObserver = new AuditLoggerObserver();

      publisher.subscribe(emailObserver);
      publisher.subscribe(inventoryObserver);
      publisher.subscribe(auditObserver);

      publisher.updateStatus('ORD-2', OrderStatus.PENDING, OrderStatus.CONFIRMED);

      expect(emailObserver.sentEmails).toHaveLength(1);
      expect(emailObserver.sentEmails[0]).toContain('ORD-2');
      expect(inventoryObserver.actions).toHaveLength(1);
      expect(inventoryObserver.actions[0]).toContain('Trừ tồn kho');
      expect(auditObserver.logs).toHaveLength(1);
    });

    it('InventoryUpdaterObserver chỉ hành động với status liên quan (CONFIRMED/CANCELLED)', () => {
      const publisher = new OrderStatusPublisher();
      const inventoryObserver = new InventoryUpdaterObserver();
      publisher.subscribe(inventoryObserver);

      publisher.updateStatus('ORD-3', OrderStatus.CONFIRMED, OrderStatus.SHIPPED);

      expect(inventoryObserver.actions).toHaveLength(0);
    });

    it('unsubscribe() ngừng nhận thông báo mà không ảnh hưởng observer khác', () => {
      const publisher = new OrderStatusPublisher();
      const emailObserver = new EmailNotifierObserver();
      const auditObserver = new AuditLoggerObserver();

      publisher.subscribe(emailObserver);
      publisher.subscribe(auditObserver);

      publisher.unsubscribe(emailObserver);
      publisher.updateStatus('ORD-4', OrderStatus.PENDING, OrderStatus.CANCELLED);

      expect(emailObserver.sentEmails).toHaveLength(0); // đã unsubscribe
      expect(auditObserver.logs).toHaveLength(1); // vẫn hoạt động bình thường
    });

    it('subscribe thêm 1 observer mới không cần sửa OrderStatusPublisher hay observer cũ', () => {
      const publisher = new OrderStatusPublisher();
      const auditObserver = new AuditLoggerObserver();
      publisher.subscribe(auditObserver);

      // Giả lập "thêm 1 bên liên quan mới" bằng 1 observer inline, không động đến
      // OrderStatusPublisher hay các observer đã có.
      const smsCalls: string[] = [];
      publisher.subscribe({
        onOrderStatusChanged: (event) => {
          smsCalls.push(`SMS cho đơn ${event.orderId}`);
        },
      });

      publisher.updateStatus('ORD-5', OrderStatus.SHIPPED, OrderStatus.DELIVERED);

      expect(auditObserver.logs).toHaveLength(1);
      expect(smsCalls).toEqual(['SMS cho đơn ORD-5']);
    });
  });
});
