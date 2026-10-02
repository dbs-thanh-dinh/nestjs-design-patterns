import { OrderPricingServiceWithoutPattern } from './without-pattern/order-pricing.without-pattern';
import { BaseOrder } from './with-pattern/base-order';
import { OrderDecorator } from './with-pattern/order.decorator';
import { GiftWrapDecorator } from './with-pattern/gift-wrap.decorator';
import { InsuranceDecorator } from './with-pattern/insurance.decorator';
import { ExpressHandlingDecorator } from './with-pattern/express-handling.decorator';

describe('Decorator Pattern - Order Pricing Add-ons', () => {
  describe('Without Pattern', () => {
    const service = new OrderPricingServiceWithoutPattern();

    it('không chon dịch vụ nao thi gia giu nguyen', () => {
      expect(service.calculateTotal(1_000_000, {})).toBe(1_000_000);
    });

    it('ket hop ca 3 dịch vụ, thu tu ap dùng LUON CỐ ĐỊNH (giftWrap -> insurance -> expressHandling)', () => {
      const total = service.calculateTotal(1_000_000, { giftWrap: true, insurance: true, expressHandling: true });
      expect(total).toBe(1_090_400);
    });

    it('mô tả phải được TỰ ĐỘNG BỔ THỦ CÔNG với calculateTotal - để sai nếu quên cập nhật 1 trong 2', () => {
      const description = service.calculateDescription('ORD-1', { giftWrap: true, expressHandling: true });
      expect(description).toBe('Don hang ORD-1 + Goi qua + Giao hoa toc');
    });
  });

  describe('With Pattern (Decorator)', () => {
    it('BaseOrder không có decorator nào thì giá và mô tả là cơ bản', () => {
      const order = new BaseOrder('ORD-2', 1_000_000);
      expect(order.getPrice()).toBe(1_000_000);
      expect(order.getDescription()).toBe('Don hang ORD-2');
    });

    it('bọc 1 lớp GiftWrapDecorator', () => {
      const order = new GiftWrapDecorator(new BaseOrder('ORD-3', 1_000_000));
      expect(order.getPrice()).toBe(1_020_000);
      expect(order.getDescription()).toBe('Don hang ORD-3 + Goi qua');
    });

    it('bọc CẢ 3 LỚP theo thứ tự GiftWrap -> Insurance -> ExpressHandling, kết quả GIỐNG HỆT without-pattern', () => {
      const order = new ExpressHandlingDecorator(
        new InsuranceDecorator(new GiftWrapDecorator(new BaseOrder('ORD-4', 1_000_000))),
      );

      expect(order.getPrice()).toBe(1_090_400); // dùng bang ket qua cũa without-pattern o trên
      expect(order.getDescription()).toBe('Don hang ORD-4 + Goi qua + Bao hiem van chuyen + Giao hoa toc');
    });

    it('THỨ TỰ bọc decorator ẢNH HƯỞNG ĐẾN KẾT QUẢ - điều mà without-pattern KHÔNG THỂ làm được', () => {
      // GiftWrap (them 20.000 co dinh) BOC BEN TRONG Insurance (tinh 2% trên
      // gia hiện tại) -> phi bảo hiem dùoc tinh TREN CA phi gọi qua.
      const giftWrapThenInsurance = new InsuranceDecorator(new GiftWrapDecorator(new BaseOrder('ORD-5', 1_000_000)));
      // Insurance BOC BEN TRONG GiftWrap -> phi bảo hiem CHI tinh trên gia
      // goc, phi gọi qua dùoc cong THEM SAU, không bi tinh % theo.
      const insuranceThenGiftWrap = new GiftWrapDecorator(new InsuranceDecorator(new BaseOrder('ORD-5', 1_000_000)));

      expect(giftWrapThenInsurance.getPrice()).toBe(1_040_400); // (1.000.000 + 20.000) * 1.02
      expect(insuranceThenGiftWrap.getPrice()).toBe(1_040_000); // (1.000.000 * 1.02) + 20.000

      expect(giftWrapThenInsurance.getPrice()).not.toBe(insuranceThenGiftWrap.getPrice());
    });

    it('có thể tạo TỔ HỢP BAT KY ma không can sua bat ky decorator nao', () => {
      // Vi dù: chỉ Insurance + ExpressHandling, không Goi qua.
      const order = new ExpressHandlingDecorator(new InsuranceDecorator(new BaseOrder('ORD-6', 500_000)));

      expect(order.getPrice()).toBe(560_000); // (500.000 * 1.02) + 50.000 = 510.000 + 50.000
      expect(order.getDescription()).toBe('Don hang ORD-6 + Bao hiem van chuyen + Giao hoa toc');
    });

    it('thêm 1 "dịch vụ" mới (ví dụ: bọc chống sóc) chỉ cần 1 decorator inline, không sửa các decorator cũ', () => {
      class BubbleWrapDecorator extends OrderDecorator {
        getPrice(): number {
          return super.getPrice() + 15000;
        }
        getDescription(): string {
          return `${super.getDescription()} + Boc chong soc`;
        }
      }

      const order = new BubbleWrapDecorator(new GiftWrapDecorator(new BaseOrder('ORD-7', 200_000)));
      expect(order.getPrice()).toBe(235_000); // 200.000 + 20.000 + 15.000
      expect(order.getDescription()).toBe('Don hang ORD-7 + Goi qua + Boc chong soc');
    });
  });
});
