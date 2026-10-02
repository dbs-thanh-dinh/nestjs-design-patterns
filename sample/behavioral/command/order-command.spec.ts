import { OrderCartServiceWithoutPattern } from './without-pattern/order-cart.without-pattern';
import { OrderCart } from './with-pattern/order-cart';
import { OrderActionInvoker } from './with-pattern/order-action.invoker';
import { AddItemCommand } from './with-pattern/add-item.command';
import { RemoveItemCommand } from './with-pattern/remove-item.command';
import { ApplyDiscountCommand } from './with-pattern/apply-discount.command';

describe('Command Pattern - Order Cart Actions', () => {
  describe('Without Pattern', () => {
    it('thêm/xóa sản phẩm và undo hoạt động đúng cho từng trường hợp riêng lẻ', () => {
      const service = new OrderCartServiceWithoutPattern();
      service.addItem({ productName: 'Áo thun', quantity: 1, unitPrice: 100000 });
      service.applyDiscount(10);

      service.undoLast(); // undo applyDiscount
      expect(service.discountPercent).toBe(0);

      service.undoLast(); // undo addItem
      expect(service.items).toHaveLength(0);
    });
  });

  describe('With Pattern (Command)', () => {
    it('thực thi và undo AddItemCommand', () => {
      const cart = new OrderCart();
      const invoker = new OrderActionInvoker();

      invoker.execute(new AddItemCommand(cart, { productName: 'Quan jean', quantity: 1, unitPrice: 450000 }));
      expect(cart.items).toHaveLength(1);

      invoker.undoLast();
      expect(cart.items).toHaveLength(0);
    });

    it('thực thi và undo RemoveItemCommand - item được chèn lại ĐÚNG vị trí cũ', () => {
      const cart = new OrderCart();
      const invoker = new OrderActionInvoker();

      invoker.execute(new AddItemCommand(cart, { productName: 'A', quantity: 1, unitPrice: 1000 }));
      invoker.execute(new AddItemCommand(cart, { productName: 'B', quantity: 1, unitPrice: 2000 }));
      invoker.execute(new RemoveItemCommand(cart, 'A'));

      expect(cart.items.map((i) => i.productName)).toEqual(['B']);

      invoker.undoLast(); // undo RemoveItemCommand('A')
      expect(cart.items.map((i) => i.productName)).toEqual(['A', 'B']); // đúng lại vị trí ban đầu
    });

    it('thực thi và undo ApplyDiscountCommand - quay lại đúng giá trị trước đó', () => {
      const cart = new OrderCart();
      const invoker = new OrderActionInvoker();

      invoker.execute(new ApplyDiscountCommand(cart, 10));
      invoker.execute(new ApplyDiscountCommand(cart, 20));
      expect(cart.getDiscount()).toBe(20);

      invoker.undoLast();
      expect(cart.getDiscount()).toBe(10); // quay lại giá trị trước đó, không phải về 0

      invoker.undoLast();
      expect(cart.getDiscount()).toBe(0);
    });

    it('undo nhiều lần liên tiếp theo đúng thứ tự NGƯỢC (LIFO)', () => {
      const cart = new OrderCart();
      const invoker = new OrderActionInvoker();

      invoker.execute(new AddItemCommand(cart, { productName: 'A', quantity: 1, unitPrice: 1000 }));
      invoker.execute(new AddItemCommand(cart, { productName: 'B', quantity: 1, unitPrice: 2000 }));
      invoker.execute(new ApplyDiscountCommand(cart, 15));

      expect(cart.items).toHaveLength(2);
      expect(cart.getDiscount()).toBe(15);

      invoker.undoLast(); // undo ApplyDiscountCommand
      expect(cart.getDiscount()).toBe(0);
      expect(cart.items).toHaveLength(2);

      invoker.undoLast(); // undo thêm 'B'
      expect(cart.items.map((i) => i.productName)).toEqual(['A']);

      invoker.undoLast(); // undo thêm 'A'
      expect(cart.items).toHaveLength(0);
    });

    it('undoLast() trả về false khi không còn gì để undo', () => {
      const invoker = new OrderActionInvoker();
      expect(invoker.undoLast()).toBe(false);
    });

    it('getHistoryDescriptions() phản ánh đúng các hành động đã thực thi (chưa undo)', () => {
      const cart = new OrderCart();
      const invoker = new OrderActionInvoker();

      invoker.execute(new AddItemCommand(cart, { productName: 'Áo khoác', quantity: 1, unitPrice: 600000 }));
      invoker.execute(new ApplyDiscountCommand(cart, 5));

      expect(invoker.getHistoryDescriptions()).toEqual([
        'Thêm sản phẩm "Áo khoác" (x1)',
        'Áp dụng giảm giá 5%',
      ]);

      invoker.undoLast();
      expect(invoker.getHistoryDescriptions()).toEqual(['Thêm sản phẩm "Áo khoác" (x1)']);
    });

    it('thêm 1 loại command mới (ví dụ inline) không cần sửa Invoker', () => {
      const invoker = new OrderActionInvoker();
      let executed = false;
      let undone = false;

      // Giả lập "thêm 1 loại hành động mới" mà không động đến OrderActionInvoker
      // hay bất kỳ command nào đã có.
      invoker.execute({
        execute: () => {
          executed = true;
        },
        undo: () => {
          undone = true;
        },
        describe: () => 'Hành động tùy chỉnh',
      });

      expect(executed).toBe(true);
      invoker.undoLast();
      expect(undone).toBe(true);
    });
  });
});
