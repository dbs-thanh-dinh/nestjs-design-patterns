import { OrderDetails } from '../order-query.types';
import { RealOrderQueryService } from '../real-order-query.service';

/**
 * KHÔNG dùng Proxy Pattern.
 *
 * Vấn đề:
 * - `OrderSummaryServiceWithoutPattern` TỰ VIẾT 1 cache riêng (bằng `Map` nội
 *   bộ) để tránh gọi lại nguồn dữ liệu nhiều lần.
 * - Nhưng `OrderInvoiceServiceWithoutPattern` - 1 nơi KHÁC trong hệ thống cùng
 *   cần tra cứu đơn hàng - lại QUÊN không dùng cache, gọi THẲNG tới
 *   `RealOrderQueryService` mỗi lần.
 * - Hệ quả: DỰ CÓ 2 SERVICE CÙNG TRA CỨU 1 ĐƠN HÀNG, chúng KHÔNG CHIA SẺ cache
 *   với nhau -> `RealOrderQueryService` vẫn bị gọi lại nhiều lần một cách
 *   không cần thiết, gây lãng phí chỉ phí/độ trễ.
 * - Logic cache bị rải rác và không nhất quán: mỗi nơi tự quyết định có cache
 *   hay không, cache theo cách nào - rất dễ sót, rất khó kiểm soát khi số
 *   lượng "nơi cần tra cứu đơn hàng" tăng lên.
 */
export class OrderSummaryServiceWithoutPattern {
  private readonly cache = new Map<string, OrderDetails>();

  constructor(private readonly realService: RealOrderQueryService) {}

  getOrderSummary(orderId: string): OrderDetails {
    if (this.cache.has(orderId)) {
      return this.cache.get(orderId) as OrderDetails;
    }
    const result = this.realService.getOrderDetails(orderId);
    this.cache.set(orderId, result);
    return result;
  }
}

export class OrderInvoiceServiceWithoutPattern {
  constructor(private readonly realService: RealOrderQueryService) {}

  getOrderForInvoice(orderId: string): OrderDetails {
    // QUÊN cache ở đây - mỗi lần xuất hóa đơn đều gọi THẲNG tới nguồn dữ liệu,
    // dù đơn hàng này có thể vừa được OrderSummaryServiceWithoutPattern tra
    // cứu (và cache) trước đó không lâu.
    return this.realService.getOrderDetails(orderId);
  }
}
