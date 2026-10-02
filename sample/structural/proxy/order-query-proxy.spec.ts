import { RealOrderQueryService } from './real-order-query.service';
import {
  OrderSummaryServiceWithoutPattern,
  OrderInvoiceServiceWithoutPattern,
} from './without-pattern/order-lookup.without-pattern';
import { CachingOrderQueryProxy } from './with-pattern/caching-order-query.proxy';
import { OrderInvoiceService } from './with-pattern/order-invoice.service';

describe('Proxy Pattern - Order Query Caching', () => {
  describe('Without Pattern', () => {
    it('OrderSummaryService từ cache dùng cho CHÍNH NÓ, giảm số lần gọi nguồn thật', () => {
      const realService = new RealOrderQueryService();
      const summaryService = new OrderSummaryServiceWithoutPattern(realService);

      summaryService.getOrderSummary('ORD-1');
      summaryService.getOrderSummary('ORD-1');
      summaryService.getOrderSummary('ORD-1');

      expect(realService.callCount).toBe(1); // cache nội bộ hoạt động đúng
    });

    it('OrderInvoiceService KHÔNG cache -> gọi nguồn thật MỖI LẦN, dù CÙNG 1 đơn hàng đã được tra cứu bởi OrderSummaryService', () => {
      const realService = new RealOrderQueryService();
      const summaryService = new OrderSummaryServiceWithoutPattern(realService);
      const invoiceService = new OrderInvoiceServiceWithoutPattern(realService);

      summaryService.getOrderSummary('ORD-1'); // callCount = 1, đã cache ở summaryService
      invoiceService.getOrderForInvoice('ORD-1'); // BUG: không biết gì về cache của summaryService
      invoiceService.getOrderForInvoice('ORD-1'); // BUG: gọi lại lần nữa

      // 2 service KHÔNG CHIA SẺ cache với nhau -> nguồn thật bị gọi dư thừa.
      expect(realService.callCount).toBe(3);
    });
  });

  describe('With Pattern (Proxy)', () => {
    it('proxy trả về ĐÚNG dữ liệu giống hệt nguồn thật', () => {
      const realService = new RealOrderQueryService();
      const proxy = new CachingOrderQueryProxy(realService);

      expect(proxy.getOrderDetails('ORD-1')).toEqual({
        orderId: 'ORD-1',
        customerName: 'Nguyen Van A',
        totalAmount: 1500000,
      });
    });

    it('chỉ gọi nguồn thật 1 LẦN cho cùng 1 orderId, các lần sau lấy từ cache', () => {
      const realService = new RealOrderQueryService();
      const proxy = new CachingOrderQueryProxy(realService);

      proxy.getOrderDetails('ORD-1');
      proxy.getOrderDetails('ORD-1');
      proxy.getOrderDetails('ORD-1');

      expect(realService.callCount).toBe(1);
      expect(proxy.cacheSize).toBe(1);
    });

    it('CHIA SẺ cache giữa NHIỀU consumer khác nhau cùng dùng 1 proxy - khác hơn without-pattern', () => {
      const realService = new RealOrderQueryService();
      const proxy = new CachingOrderQueryProxy(realService);

      // 2 "consumer" khác nhau, nhưng CÙNG DÙNG 1 proxy instance.
      const invoiceService = new OrderInvoiceService(proxy);

      proxy.getOrderDetails('ORD-1'); // callCount = 1, lưu vào cache
      invoiceService.getOrderForInvoice('ORD-1'); // lấy từ cache, KHÔNG gọi nguồn thật nữa

      expect(realService.callCount).toBe(1); // khác hơn bản without-pattern (callCount = 3)
    });

    it('cache được phân biệt theo TỪNG orderId', () => {
      const realService = new RealOrderQueryService();
      const proxy = new CachingOrderQueryProxy(realService);

      proxy.getOrderDetails('ORD-1');
      proxy.getOrderDetails('ORD-2');
      proxy.getOrderDetails('ORD-1');
      proxy.getOrderDetails('ORD-2');

      expect(realService.callCount).toBe(2); // mỗi orderId chỉ gọi nguồn thật 1 lần
      expect(proxy.cacheSize).toBe(2);
    });

    it('invalidate() xóa cache 1 đơn hàng cụ thể, lần gọi tiếp theo sẽ gọi lại nguồn thật', () => {
      const realService = new RealOrderQueryService();
      const proxy = new CachingOrderQueryProxy(realService);

      proxy.getOrderDetails('ORD-1');
      proxy.invalidate('ORD-1');
      proxy.getOrderDetails('ORD-1');

      expect(realService.callCount).toBe(2);
    });

    it('clearCache() xóa toàn bộ cache', () => {
      const realService = new RealOrderQueryService();
      const proxy = new CachingOrderQueryProxy(realService);

      proxy.getOrderDetails('ORD-1');
      proxy.getOrderDetails('ORD-2');
      proxy.clearCache();

      expect(proxy.cacheSize).toBe(0);
      proxy.getOrderDetails('ORD-1');
      expect(realService.callCount).toBe(3); // 2 lần đầu + 1 lần sau khi clear
    });

    it('consumer chỉ phụ thuộc vào IOrderQueryService, hoạt động đúng cả khi truyền nguồn thật hoặc proxy', () => {
      const realService = new RealOrderQueryService();

      const invoiceServiceWithRealSource = new OrderInvoiceService(realService);
      const invoiceServiceWithProxy = new OrderInvoiceService(new CachingOrderQueryProxy(realService));

      expect(invoiceServiceWithRealSource.getOrderForInvoice('ORD-2').customerName).toBe('Tran Thi B');
      expect(invoiceServiceWithProxy.getOrderForInvoice('ORD-2').customerName).toBe('Tran Thi B');
    });
  });
});
