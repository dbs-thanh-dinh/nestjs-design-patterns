import { OrderStatus } from './order-lifecycle.types';
import { OrderLifecycleServiceWithoutPattern } from './without-pattern/order-lifecycle.without-pattern';
import { OrderContext } from './with-pattern/order.context';
import { PendingState } from './with-pattern/pending.state';

function createOrder(orderId: string): OrderContext {
  return new OrderContext(orderId, new PendingState());
}

describe('State Pattern - Order Lifecycle', () => {
  describe('Without Pattern', () => {
    it('cho phep di chuyen dung luong: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED', () => {
      const service = new OrderLifecycleServiceWithoutPattern();
      service.confirm();
      service.ship();
      service.deliver();

      expect(service.getStatus()).toBe(OrderStatus.DELIVERED);
    });

    it('nêm lỗi khi thực hiện hành động không hợp lệ voi trang thai hien tai', () => {
      const service = new OrderLifecycleServiceWithoutPattern();
      expect(() => service.ship()).toThrow(/Không thể thực hiện "ship"/);
    });

    it('không thể hủy don sau khi đã SHIPPED', () => {
      const service = new OrderLifecycleServiceWithoutPattern();
      service.confirm();
      service.ship();
      expect(() => service.cancel()).toThrow(/Không thể thực hiện "cancel" khi đơn hàng đang ở trạng thái SHIPPED/);
    });
  });

  describe('With Pattern (State)', () => {
    it('cho phep di chuyen dung luong: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED', () => {
      const order = createOrder('ORD-1');
      expect(order.currentStatus).toBe(OrderStatus.PENDING);

      order.confirm();
      expect(order.currentStatus).toBe(OrderStatus.CONFIRMED);

      order.ship();
      expect(order.currentStatus).toBe(OrderStatus.SHIPPED);

      order.deliver();
      expect(order.currentStatus).toBe(OrderStatus.DELIVERED);
    });

    it('nêm lỗi khi thực hiện hành động không hợp lệ voi trang thai hien tai', () => {
      const order = createOrder('ORD-2');
      expect(() => order.ship()).toThrow('Khong the thuc hien "ship" khi don hang dang o trang thai PENDING');
    });

    it('hủy đơn từ PENDING được phép', () => {
      const order = createOrder('ORD-3');
      order.cancel();
      expect(order.currentStatus).toBe(OrderStatus.CANCELLED);
    });

    it('hủy đơn từ CONFIRMED được phép', () => {
      const order = createOrder('ORD-4');
      order.confirm();
      order.cancel();
      expect(order.currentStatus).toBe(OrderStatus.CANCELLED);
    });

    it('KHÔNG thể huy don sau khi đã SHIPPED - quy tắc nằm ngay trong ShippedState', () => {
      const order = createOrder('ORD-5');
      order.confirm();
      order.ship();

      expect(() => order.cancel()).toThrow('Khong the thuc hien "cancel" khi don hang dang o trang thai SHIPPED');
      expect(order.currentStatus).toBe(OrderStatus.SHIPPED); // trạng thái không đổi khi loi
    });

    it('DELIVERED và CANCELLED là trạng thái cuối, mỗi hành động đều bị tự chối', () => {
      const deliveredOrder = createOrder('ORD-6');
      deliveredOrder.confirm();
      deliveredOrder.ship();
      deliveredOrder.deliver();

      expect(() => deliveredOrder.confirm()).toThrow(/DELIVERED/);
      expect(() => deliveredOrder.cancel()).toThrow(/DELIVERED/);

      const cancelledOrder = createOrder('ORD-7');
      cancelledOrder.cancel();

      expect(() => cancelledOrder.confirm()).toThrow(/CANCELLED/);
      expect(() => cancelledOrder.ship()).toThrow(/CANCELLED/);
    });

    it('mỗi OrderContext giữ trạng thái riêng, không ảnh hưởng lẫn nhau', () => {
      const orderA = createOrder('ORD-8');
      const orderB = createOrder('ORD-9');

      orderA.confirm();

      expect(orderA.currentStatus).toBe(OrderStatus.CONFIRMED);
      expect(orderB.currentStatus).toBe(OrderStatus.PENDING);
    });
  });
});
