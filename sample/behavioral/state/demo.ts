/**
 * Chạy thử: npm run sample:state
 */
import { OrderLifecycleServiceWithoutPattern } from './without-pattern/order-lifecycle.without-pattern';
import { OrderContext } from './with-pattern/order.context';
import { PendingState } from './with-pattern/pending.state';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN (if/else rải rác trong từng method)');
const withoutPatternOrder = new OrderLifecycleServiceWithoutPattern();
console.log('Trạng thái ban đầu:', withoutPatternOrder.getStatus());
withoutPatternOrder.confirm();
withoutPatternOrder.ship();
console.log('Sau confirm() + ship():', withoutPatternOrder.getStatus());
try {
  withoutPatternOrder.cancel();
} catch (error) {
  console.log('Thử cancel() sau khi đã ship() -> lỗi:', (error as Error).message);
}

line('WITH PATTERN (State) - di chuyển đúng luồng');
const order = new OrderContext('ORD-100', new PendingState());
console.log('Trạng thái ban đầu:', order.currentStatus);
order.confirm();
console.log('Sau confirm():', order.currentStatus);
order.ship();
console.log('Sau ship():', order.currentStatus);
order.deliver();
console.log('Sau deliver():', order.currentStatus);

line('WITH PATTERN - thử hành động không hợp lệ');
try {
  order.confirm();
} catch (error) {
  console.log('Thử confirm() khi đã DELIVERED -> lỗi:', (error as Error).message);
}

line('WITH PATTERN - hủy đơn ở giai đoạn cho phép');
const cancellableOrder = new OrderContext('ORD-101', new PendingState());
cancellableOrder.confirm();
cancellableOrder.cancel();
console.log('Trạng thái sau khi hủy từ CONFIRMED:', cancellableOrder.currentStatus);

line('WITH PATTERN - KHÔNG thể hủy đơn đã SHIPPED');
const shippedOrder = new OrderContext('ORD-102', new PendingState());
shippedOrder.confirm();
shippedOrder.ship();
try {
  shippedOrder.cancel();
} catch (error) {
  console.log('Thử cancel() sau khi đã ship() -> lỗi:', (error as Error).message);
}

console.log('\nDemo hoàn thành.\n');
