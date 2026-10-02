import { OrderIdGeneratorWithoutPattern } from './without-pattern/order-id-generator.without-pattern';
import { OrderIdGenerator } from './with-pattern/order-id-generator.singleton';

describe('Singleton Pattern - Order ID Generator', () => {
  describe('Without Pattern', () => {
    it('2 instance khác nhau sẽ sinh ra ID TRÙNG NHAU (lỗi cạnh tranh)', () => {
      // Giả lập 2 "nơi" khác nhau trong code (ví dụ 2 service) cũng từ `new` ra
      // generator của riêng mình.
      const generatorInOrderService = new OrderIdGeneratorWithoutPattern();
      const generatorInImportService = new OrderIdGeneratorWithoutPattern();

      const idFromOrderService = generatorInOrderService.generate();
      const idFromImportService = generatorInImportService.generate();

      // Đây chính là vấn đề: cả 2 đều là "ORD-000001" vì mỗi instance tự đếm từ 0.
      expect(idFromOrderService).toBe('ORD-000001');
      expect(idFromImportService).toBe('ORD-000001');
      expect(idFromOrderService).toBe(idFromImportService);
    });
  });

  describe('With Pattern (Singleton)', () => {
    beforeEach(() => {
      // Reset singleton trước mỗi test để các test case độc lập với nhau.
      OrderIdGenerator.resetForTesting();
    });

    it('Gọi getInstance() nhiều lần vẫn trả về CUNG 1 instance', () => {
      const instanceA = OrderIdGenerator.getInstance();
      const instanceB = OrderIdGenerator.getInstance();

      expect(instanceA).toBe(instanceB);
    });

    it('2 "nơi gọi" khác nhau dùng chung 1 bộ đếm -> không bao giờ trùng ID', () => {
      const generatorInOrderService = OrderIdGenerator.getInstance();
      const generatorInImportService = OrderIdGenerator.getInstance();

      const idFromOrderService = generatorInOrderService.generate();
      const idFromImportService = generatorInImportService.generate();

      expect(idFromOrderService).toBe('ORD-000001');
      expect(idFromImportService).toBe('ORD-000002');
      expect(idFromOrderService).not.toBe(idFromImportService);
    });

    it('getInfo() phản ánh dùng sequence hiện tại của instance dùng chung', () => {
      const generator = OrderIdGenerator.getInstance();
      generator.generate();
      generator.generate();
      generator.generate();

      expect(generator.getInfo()).toEqual({ prefix: 'ORD', currentSequence: 3 });
    });
  });
});
