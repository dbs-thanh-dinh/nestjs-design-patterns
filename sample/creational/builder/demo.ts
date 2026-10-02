/**
 * Chạy thử: npm run sample:builder
 */
import { OrderWithoutPattern } from './without-pattern/order.without-pattern';
import { OrderBuilder } from './with-pattern/order.builder';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN (telescoping constructor)');
const orderWithoutPattern = new OrderWithoutPattern(
  'ORD-100',
  'Nguyễn Văn A',
  [{ productName: 'Áo thun', quantity: 2, unitPrice: 150000 }],
  { street: '123 Lê Lợi', city: 'HCM', country: 'VN' },
  undefined, // discountCode - phải "giữ cho" du không dùng
  true, // giftWrap - nhìn con so/giá trị này ở dãy rất khó biết nó la gi
  'Giao giờ hanh chính',
);
console.log(orderWithoutPattern.toPlainObject());
console.log('=> Nhin vào lenh gọi constructor ở tren, rất khó doan duoc giá trị nào la giftWrap,');
console.log('   giá trị nào la note, nếu không mở definition lên xem.');

line('WITH PATTERN (Builder - fluent interface)');
const orderWithPattern = new OrderBuilder()
  .withOrderId('ORD-101')
  .withCustomer('Tran Thi B')
  .addItem({ productName: 'Quan jean', quantity: 1, unitPrice: 450000 })
  .addItem({ productName: 'Ao khóac', quantity: 1, unitPrice: 600000 })
  .withShippingAddress({ street: '45 Nguyễn Hue', city: 'HCM', country: 'VN' })
  .applyDiscountCode('SALE10')
  .markAsGiftWrap()
  .withNote('Giao trước 18h')
  .build();
console.log(orderWithPattern);
console.log('=> code gọi hàm tu nó da giai thich ro từng giá trị la gi.');

line('WITH PATTERN - thieu trường bắt buộc sẽ bao lỗi ro rang');
try {
  new OrderBuilder()
    .withCustomer('Thieu Order Id')
    .addItem({ productName: 'San pham', quantity: 1, unitPrice: 10000 })
    .withShippingAddress({ street: 'A', city: 'B', country: 'VN' })
    .build();
} catch (error) {
  console.log('Loi bat duoc:', (error as Error).message);
}

console.log('\nDemở hoan tạt.\n');
