/**
 * Chạy thử: npm run sample:command
 */
import { OrderCartServiceWithoutPattern } from './without-pattern/order-cart.without-pattern';
import { OrderCart } from './with-pattern/order-cart';
import { OrderActionInvoker } from './with-pattern/order-action.invoker';
import { AddItemCommand } from './with-pattern/add-item.command';
import { RemoveItemCommand } from './with-pattern/remove-item.command';
import { ApplyDiscountCommand } from './with-pattern/apply-discount.command';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN (undoLast() phải tự đoán từng loại hành động)');
const withoutPatternCart = new OrderCartServiceWithoutPattern();
withoutPatternCart.addItem({ productName: 'Áo thun', quantity: 2, unitPrice: 150000 });
withoutPatternCart.applyDiscount(10);
console.log('Sau khi thêm item + áp dụng giảm giá:', {
  items: withoutPatternCart.items,
  discountPercent: withoutPatternCart.discountPercent,
});
withoutPatternCart.undoLast();
console.log('Sau 1 lần undoLast() (hoàn tác giảm giá):', {
  discountPercent: withoutPatternCart.discountPercent,
});

line('WITH PATTERN (Command) - thực thi qua Invoker, lưu lịch sử');
const cart = new OrderCart();
const invoker = new OrderActionInvoker();

invoker.execute(new AddItemCommand(cart, { productName: 'Quần jean', quantity: 1, unitPrice: 450000 }));
invoker.execute(new AddItemCommand(cart, { productName: 'Áo khoác', quantity: 1, unitPrice: 600000 }));
invoker.execute(new ApplyDiscountCommand(cart, 10));

console.log('Giỏ hàng hiện tại:', cart.items);
console.log('Giảm giá hiện tại:', cart.getDiscount(), '%');
console.log('Lịch sử thao tác:', invoker.getHistoryDescriptions());

line('WITH PATTERN - undo() liên tiếp theo đúng thứ tự NGƯỢC (LIFO)');
invoker.undoLast();
console.log('Sau undo lần 1 (hoàn tác áp dụng giảm giá):', {
  discount: cart.getDiscount(),
  items: cart.items.map((i) => i.productName),
});

invoker.undoLast();
console.log('Sau undo lần 2 (hoàn tác thêm "Áo khoác"):', {
  items: cart.items.map((i) => i.productName),
});

line('WITH PATTERN - xóa sản phẩm rồi undo, item quay lại ĐÚNG vị trí cũ');
invoker.execute(new AddItemCommand(cart, { productName: 'Nón', quantity: 1, unitPrice: 80000 }));
console.log('Trước khi xóa:', cart.items.map((i) => i.productName));
invoker.execute(new RemoveItemCommand(cart, 'Quần jean'));
console.log('Sau khi xóa "Quần jean":', cart.items.map((i) => i.productName));
invoker.undoLast();
console.log('Sau undo (chèn lại "Quần jean" đúng vị trí):', cart.items.map((i) => i.productName));

console.log('\nDemo hoàn thành.\n');
