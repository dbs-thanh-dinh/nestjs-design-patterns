import { OrderWithoutPattern } from './without-pattern/order.without-pattern';
import { OrderBuilder } from './with-pattern/order.builder';

describe('Builder Pattern - Order Construction', () => {
  describe('Without Pattern (telescoping constructor)', () => {
    it('tạo Order dùng chung code gọi hàm khó đọc, dễ truyền nhầm vị trí', () => {
      const order = new OrderWithoutPattern(
        'ORD-1',
        'Nguyễn Văn A',
        [{ productName: 'Áo thun', quantity: 2, unitPrice: 150000 }],
        { street: '123 Lê Lợi', city: 'HCM', country: 'VN' },
        undefined, // discountCode - phải truyền undefined du không dùng, chỉ để "giữ cho"
        true, // giftWrap - nhìn vào dãy không biết ngay là giftWrap nếu không xem constructor
        'Giao giờ hành chính',
      );

      expect(order.orderId).toBe('ORD-1');
      expect(order.giftWrap).toBe(true);
      expect(order.discountCode).toBeUndefined();
    });
  });

  describe('With Pattern (Builder)', () => {
    it('tạo Order qua fluent interface, dễ đọc và không cần truyền undefined "giữ chỗ"', () => {
      const order = new OrderBuilder()
        .withOrderId('ORD-2')
        .withCustomer('Tran Thi B')
        .addItem({ productName: 'Quan jean', quantity: 1, unitPrice: 450000 })
        .addItem({ productName: 'Ao khóac', quantity: 1, unitPrice: 600000 })
        .withShippingAddress({ street: '45 Nguyễn Hue', city: 'HCM', country: 'VN' })
        .applyDiscountCode('SALE10')
        .markAsGiftWrap()
        .build();

      expect(order.orderId).toBe('ORD-2');
      expect(order.items).toHaveLength(2);
      expect(order.discountCode).toBe('SALE10');
      expect(order.giftWrap).toBe(true);
    });

    it('các trường tùy chọn không gọi thi co giá trị mặc định hợp lý', () => {
      const order = new OrderBuilder()
        .withOrderId('ORD-3')
        .withCustomer('Le Văn C')
        .addItem({ productName: 'Mu bao hiem', quantity: 1, unitPrice: 250000 })
        .withShippingAddress({ street: '9 Tran Hung Dao', city: 'Da Nang', country: 'VN' })
        .build();

      expect(order.giftWrap).toBe(false);
      expect(order.discountCode).toBeUndefined();
      expect(order.note).toBeUndefined();
    });

    it('ném lỗi rõ ràng khi thiếu trường bắt buộc (orderId)', () => {
      expect(() =>
        new OrderBuilder()
          .withCustomer('Thieu Order Id')
          .addItem({ productName: 'San pham', quantity: 1, unitPrice: 10000 })
          .withShippingAddress({ street: 'A', city: 'B', country: 'VN' })
          .build(),
      ).toThrow(/thieu orderId/);
    });

    it('ném lỗi rõ ràng khi không có sản phẩm nào', () => {
      expect(() =>
        new OrderBuilder()
          .withOrderId('ORD-4')
          .withCustomer('Khóng co san pham')
          .withShippingAddress({ street: 'A', city: 'B', country: 'VN' })
          .build(),
      ).toThrow(/it nhat 1 san pham/);
    });

    it('mỗi lần `new OrderBuilder()` là 1 instance sạch, không dính state của lần trước', () => {
      const builder1 = new OrderBuilder()
        .withOrderId('ORD-5')
        .withCustomer('A')
        .addItem({ productName: 'X', quantity: 1, unitPrice: 1000 })
        .withShippingAddress({ street: 'A', city: 'B', country: 'VN' });

      const builder2 = new OrderBuilder()
        .withOrderId('ORD-6')
        .withCustomer('B')
        .withShippingAddress({ street: 'C', city: 'D', country: 'VN' });
      // builder2 không addItem() -> phải bao lỗi riêng, không bi ảnh hưởng bởi item của builder1.

      expect(builder1.build().items).toHaveLength(1);
      expect(() => builder2.build()).toThrow(/it nhat 1 san pham/);
    });
  });
});
