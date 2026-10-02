/**
 * Chạy thử: npm run sample:facade
 */
import { InventorySubsystem } from './subsystems/inventory.subsystem';
import { PaymentSubsystem } from './subsystems/payment.subsystem';
import { ShippingSubsystem } from './subsystems/shipping.subsystem';
import { NotificationSubsystem } from './subsystems/notification.subsystem';
import { AdminManualOrderWithoutPattern } from './without-pattern/checkout.without-pattern';
import { OrderCheckoutFacade } from './with-pattern/order-checkout.facade';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

const customer = { email: 'khach@example.com', shippingAddress: '123 Le Loi, HCM' };

line('WITHOUT PATTERN - AdminManualOrder QUEN rollback khi thanh toán thất bại');
const inventoryA = new InventorySubsystem();
const adminOrder = new AdminManualOrderWithoutPattern(
  inventoryA,
  new PaymentSubsystem(),
  new ShippingSubsystem(),
  new NotificationSubsystem(),
);
console.log('Ton kho Ao thun TRUOC khi dat don:', inventoryA.getAvailableQuantity('Ao thun'));
const failedResult = adminOrder.createOrderFromAdmin(
  'ORD-100',
  [{ productName: 'Ao thun', quantity: 10, unitPrice: 600000 }], // 6.000.000 -> vuot han muc, payment thất bại
  customer,
);
console.log('Ket qua dat don (thất bại o bước payment):', failedResult);
console.log('Ton kho Ao thun SAU khi dat don thất bại:', inventoryA.getAvailableQuantity('Ao thun'));
console.log('=> BUG: ton kho bi giu nham vinh vien vì code này QUEN rollback!');

line('WITH PATTERN (Facade) - placeOrder() TU DONG rollback dùng, không the quen');
const inventoryB = new InventorySubsystem();
const facade = new OrderCheckoutFacade(
  inventoryB,
  new PaymentSubsystem(),
  new ShippingSubsystem(),
  new NotificationSubsystem(),
);
console.log('Ton kho Ao thun TRUOC khi dat don:', inventoryB.getAvailableQuantity('Ao thun'));
const facadeFailedResult = facade.placeOrder(
  'ORD-101',
  [{ productName: 'Ao thun', quantity: 10, unitPrice: 600000 }],
  customer,
);
console.log('Ket qua dat don (thất bại o bước payment):', facadeFailedResult);
console.log('Ton kho Ao thun SAU khi dat don thất bại:', inventoryB.getAvailableQuantity('Ao thun'));
console.log('=> Ton kho được tra lai DUNG vì rollback chỉ dinh nghia 1 lần duy nhất trong Facade.');

line('WITH PATTERN - dat don thanh cong, chỉ 1 lỗi gọi duy nhất');
const successResult = facade.placeOrder(
  'ORD-102',
  [{ productName: 'Quan jean', quantity: 2, unitPrice: 450000 }],
  customer,
);
console.log(successResult);

console.log('\nDemo hoan tat.\n');
