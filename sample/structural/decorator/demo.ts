/**
 * Chạy thử: npm run sample:decorator
 */
import { OrderPricingServiceWithoutPattern } from './without-pattern/order-pricing.without-pattern';
import { BaseOrder } from './with-pattern/base-order';
import { GiftWrapDecorator } from './with-pattern/gift-wrap.decorator';
import { InsuranceDecorator } from './with-pattern/insurance.decorator';
import { ExpressHandlingDecorator } from './with-pattern/express-handling.decorator';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN (boolean flags + if/else, thu tu ap dùng CỐ ĐỊNH)');
const withoutPatternService = new OrderPricingServiceWithoutPattern();
const options = { giftWrap: true, insurance: true, expressHandling: true };
console.log('Mo ta:', withoutPatternService.calculateDescription('ORD-100', options));
console.log('Tong tien:', withoutPatternService.calculateTotal(1_000_000, options));

line('WITH PATTERN (Decorator) - xep chong 3 lop theo dùng thu tu trên');
const fullyDecoratedOrder = new ExpressHandlingDecorator(
  new InsuranceDecorator(new GiftWrapDecorator(new BaseOrder('ORD-101', 1_000_000))),
);
console.log('Mo ta:', fullyDecoratedOrder.getDescription());
console.log('Tong tien:', fullyDecoratedOrder.getPrice(), '(giong het ket qua without-pattern o trên)');

line('WITH PATTERN - CHỈ cần đổi THỨ TỰ bọc, KẾT QUẢ THAY ĐỔI (điều without-pattern KHÔNG làm được)');
const giftWrapThenInsurance = new InsuranceDecorator(new GiftWrapDecorator(new BaseOrder('ORD-102', 1_000_000)));
const insuranceThenGiftWrap = new GiftWrapDecorator(new InsuranceDecorator(new BaseOrder('ORD-102', 1_000_000)));

console.log('GiftWrap bọc TRƯỚC, Insurance bọc SAU (bảo hiem tinh % trên gia đã có phi gọi qua):');
console.log(' ->', giftWrapThenInsurance.getPrice());
console.log('Insurance bọc TRƯỚC, GiftWrap bọc SAU (bảo hiem chỉ tinh % trên gia goc):');
console.log(' ->', insuranceThenGiftWrap.getPrice());

line('WITH PATTERN - tạo TỔ HỢP BẤT KỲ khác, không động đến decorator nào');
const onlyInsuranceAndExpress = new ExpressHandlingDecorator(new InsuranceDecorator(new BaseOrder('ORD-103', 500_000)));
console.log('Chi Bao hiem + Giao hoa toc (không Goi qua):');
console.log(' Mo ta:', onlyInsuranceAndExpress.getDescription());
console.log(' Tong tien:', onlyInsuranceAndExpress.getPrice());

console.log('\nDemo hoan tat.\n');
