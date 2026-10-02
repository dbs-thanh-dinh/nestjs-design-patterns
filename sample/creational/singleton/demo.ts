/**
 * Chạy thử: npm run sample:singleton
 */
import { OrderIdGeneratorWithoutPattern } from './without-pattern/order-id-generator.without-pattern';
import { OrderIdGenerator } from './with-pattern/order-id-generator.singleton';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN (mỗi nơi từ new ra 1 instance riêng)');
const generatorInOrderService = new OrderIdGeneratorWithoutPattern();
const generatorInImportService = new OrderIdGeneratorWithoutPattern();

console.log('OrderService sinh ID:', generatorInOrderService.generate());
console.log('ImportService sinh ID:', generatorInImportService.generate());
console.log('=> 2 ID ở trên bị TRÙNG NHAU, dù la 2 đơn hàng khác nhau!');

line('WITH PATTERN (Singleton - dùng chung 1 instance)');
const singletonInOrderService = OrderIdGenerator.getInstance();
const singletonInImportService = OrderIdGenerator.getInstance();

console.log('OrderService sinh ID:', singletonInOrderService.generate());
console.log('ImportService sinh ID:', singletonInImportService.generate());
console.log('OrderService sinh tiep ID:', singletonInOrderService.generate());
console.log('=> Cả 3 ID đều là duy nhất vì dùng chung 1 bộ đếm.');
console.log('Thông tin sequence hiện tại:', singletonInOrderService.getInfo());

console.log('\nDemo hoàn tất.\n');
