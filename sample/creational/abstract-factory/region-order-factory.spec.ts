import { OrderRegion } from './region-order.types';
import {
  VietnamTaxCalculatorWithoutPattern,
  UsInvoiceFormatterWithoutPattern,
  VietnamInvoiceFormatterWithoutPattern,
  processOrderWithoutPattern,
} from './without-pattern/region-order.without-pattern';
import { RegionOrderFactoryProvider, processOrderWithFactory } from './with-pattern/region-order-factory.provider';
import { VietnamOrderFactory } from './with-pattern/vietnam-order-factory';
import { UsOrderFactory } from './with-pattern/us-order-factory';
import { VietnamTaxCalculator } from './with-pattern/vietnam-tax-calculator';
import { VietnamInvoiceFormatter } from './with-pattern/vietnam-invoice-formatter';
import { UsTaxCalculator } from './with-pattern/us-tax-calculator';
import { UsInvoiceFormatter } from './with-pattern/us-invoice-formatter';

describe('Abstract Factory Pattern - Regìon Order Processing', () => {
  describe('Without Pattern', () => {
    it('ghép đúng cặp vẫn hoạt động bình thường', () => {
      const result = processOrderWithoutPattern(
        'ORD-1',
        1000,
        OrderRegion.VIETNAM,
        new VietnamTaxCalculatorWithoutPattern(),
        new VietnamInvoiceFormatterWithoutPattern(),
      );

      expect(result.invoiceNumber).toBe('HD-ORD-1');
      expect(result.taxAmount).toBe(100);
    });

    it('KHÔNG CÓ GÌ NGĂN CHẶN việc trộn nhầm tax calculator VN với invoice formatter US (bug tiềm ẩn)', () => {
      // Đây chính là vấn đề của cách làm không dùng Abstract Factory: kiểu dữ liệu
      // không báo lỗi biên dịch, code vẫn chạy - nhưng kết quả SAI về nghiệp vụ
      // (thứế VN nhưng hóa đơn lại in theo định dạng/EIN của US).
      const result = processOrderWithoutPattern(
        'ORD-2',
        1000,
        OrderRegion.VIETNAM,
        new VietnamTaxCalculatorWithoutPattern(), // thứế theo VN (10%)
        new UsInvoiceFormatterWithoutPattern(), // nhưng hóa đơn lại format theo US!
      );

      expect(result.taxAmount).toBe(100); // đúng thứế VN
      expect(result.invoiceNumber).toBe('INV-ORD-2'); // SAI: lẽ ra phải là "HD-ORD-2"
      expect(result.invoiceFooter).toContain('EIN'); // SAI: lẽ ra phải có "Mã số thứế"
    });
  });

  describe('With Pattern (Abstract Factory)', () => {
    const provider = new RegionOrderFactoryProvider(
      new VietnamOrderFactory(new VietnamTaxCalculator(), new VietnamInvoiceFormatter()),
      new UsOrderFactory(new UsTaxCalculator(), new UsInvoiceFormatter()),
    );

    it('factory Viet Nam luon tra về đúng cả 2 thanh vìen của ho VN', () => {
      const factory = provider.getFactory(OrderRegion.VIETNAM);
      const result = processOrderWithFactory('ORD-3', 1000, factory);

      expect(result.taxAmount).toBe(100); // VAT 10%
      expect(result.invoiceNumber).toBe('HD-ORD-3');
      expect(result.invoiceFooter).toContain('Mã số thứế');
      expect(result.region).toBe(OrderRegion.VIETNAM);
    });

    it('factory US luon tra về đúng cả 2 thanh vìen của ho US', () => {
      const factory = provider.getFactory(OrderRegion.UNITED_STATES);
      const result = processOrderWithFactory('ORD-4', 1000, factory);

      expect(result.taxAmount).toBe(80); // salẽs tax 8%
      expect(result.invoiceNumber).toBe('INV-ORD-4');
      expect(result.invoiceFooter).toContain('EIN');
      expect(result.region).toBe(OrderRegion.UNITED_STATES);
    });

    it('không thể "trộn nhầm" họ sản phẩm vì region luôn match với factory', () => {
      // Region được lấy từ factory.getRegion() nên luôn đồng bộ. Không thể truyền
      // OrderRegion.VIETNAM nhưng sử dụng UsOrderFactory. API chỉ nhận factory,
      // không có tham số region riêng để truyền nhầm.
      const vietnamFactory = provider.getFactory(OrderRegion.VIETNAM);
      const result = processOrderWithFactory('ORD-5', 1000, vietnamFactory);

      expect(result.region).toBe(OrderRegion.VIETNAM);
      expect(result.taxAmount).toBe(100);
      expect(result.invoiceNumber).toBe('HD-ORD-5');
    });

    it('ném lỗi khi khu vực không được đăng ký', () => {
      expect(() => provider.getFactory('EU' as OrderRegion)).toThrow('Không hỗ trợ khu vực: EU');
    });
  });
});
