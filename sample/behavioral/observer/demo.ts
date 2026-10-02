/**
 * Chạy thử: npm run sample:observer
 */
import { OrderStatus } from './order-status.types';
import { OrderStatusServiceWithoutPattern } from './without-pattern/order-status.without-pattern';
import { OrderStatusPublisher } from './with-pattern/order-status.publisher';
import { EmailNotifierObserver } from './with-pattern/email-notifier.observer';
import { InventoryUpdaterObserver } from './with-pattern/inventory-updater.observer';
import { AuditLoggerObserver } from './with-pattern/audit-logger.observer';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN (logic thông báo bị trộn hết vào 1 method)');
const withoutPatternService = new OrderStatusServiceWithoutPattern();
withoutPatternService.updateStatus('ORD-100', OrderStatus.PENDING, OrderStatus.CONFIRMED);

line('WITH PATTERN (Observer) - 3 observer cùng lắng nghe 1 sự kiện');
const publisher = new OrderStatusPublisher();
const emailObserver = new EmailNotifierObserver();
const inventoryObserver = new InventoryUpdaterObserver();
const auditObserver = new AuditLoggerObserver();

publisher.subscribe(emailObserver);
publisher.subscribe(inventoryObserver);
publisher.subscribe(auditObserver);

publisher.updateStatus('ORD-200', OrderStatus.PENDING, OrderStatus.CONFIRMED);

line('WITH PATTERN - unsubscribe() 1 observer lúc runtime');
console.log('Tạm ngừng gửi email (unsubscribe emailObserver)...');
publisher.unsubscribe(emailObserver);
publisher.updateStatus('ORD-200', OrderStatus.CONFIRMED, OrderStatus.SHIPPED);
console.log('=> Chỉ còn inventory và audit nhận được thông báo, email không còn được gọi nữa.');

line('WITH PATTERN - thêm 1 observer mới mà không sửa publisher/observer cũ');
publisher.subscribe({
  onOrderStatusChanged: (event) => {
    console.log(`[SMS] Gửi SMS cho đơn hàng ${event.orderId}: đã chuyển sang ${event.newStatus}`);
  },
});
publisher.updateStatus('ORD-200', OrderStatus.SHIPPED, OrderStatus.DELIVERED);

console.log('\nDemo hoàn thành.\n');
