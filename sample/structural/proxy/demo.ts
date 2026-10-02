/**
 * Chạy thử: npm run sample:proxy
 */
import { RealOrderQueryService } from './real-order-query.service';
import {
  OrderSummaryServiceWithoutPattern,
  OrderInvoiceServiceWithoutPattern,
} from './without-pattern/order-lookup.without-pattern';
import { CachingOrderQueryProxy } from './with-pattern/caching-order-query.proxy';
import { OrderInvoiceService } from './with-pattern/order-invoice.service';

function line(title: string) {
  console.log(`\n=== ${title} ===`);
}

line('WITHOUT PATTERN - 2 service từ cache riêng, không chỉa sẻ với nhau');
const realServiceA = new RealOrderQueryService();
const summaryService = new OrderSummaryServiceWithoutPattern(realServiceA);
const invoiceServiceWithoutPattern = new OrderInvoiceServiceWithoutPattern(realServiceA);

summaryService.getOrderSummary('ORD-1');
summaryService.getOrderSummary('ORD-1'); // lấy từ cache RIÊNG của summaryService
invoiceServiceWithoutPattern.getOrderForInvoice('ORD-1'); // QUÊN cache -> gọi lại nguồn thật
invoiceServiceWithoutPattern.getOrderForInvoice('ORD-1'); // gọi lại lần nữa

console.log(`Số lần gọi RealOrderQueryService (nguồn dữ liệu): ${realServiceA.callCount}`);
console.log('=> Dù CÙNG 1 đơn hàng ORD-1, nguồn thật bị gọi tới 3 LẦN vì 2 service không chỉa sẻ cache.');

line('WITH PATTERN (Proxy) - mỗi consumer dùng CÙNG 1 proxy, cache được chỉa sẻ');
const realServiceB = new RealOrderQueryService();
const proxy = new CachingOrderQueryProxy(realServiceB);
const invoiceServiceWithProxy = new OrderInvoiceService(proxy); // consumer chỉ biết IOrderQueryService

proxy.getOrderDetails('ORD-1');
proxy.getOrderDetails('ORD-1'); // lấy từ cache
invoiceServiceWithProxy.getOrderForInvoice('ORD-1'); // vẫn là CÙNG 1 cache, lấy từ cache
invoiceServiceWithProxy.getOrderForInvoice('ORD-1');

console.log(`Số lần gọi RealOrderQueryService (nguồn dữ liệu): ${realServiceB.callCount}`);
console.log('=> Chỉ 1 LẦN DUY NHẤT, vì tất cả consumer dùng chùng 1 proxy và chỉa sẻ cache.');

line('WITH PATTERN - cache phân biệt theo từng orderId');
proxy.getOrderDetails('ORD-2');
console.log(`Số lần gọi nguồn thật sau khi tra cứu thêm ORD-2: ${realServiceB.callCount}`);
console.log('Kích thước cache hiện tại:', proxy.cacheSize);

line('WITH PATTERN - invalidate() 1 đơn hàng cụ thể');
proxy.invalidate('ORD-1');
proxy.getOrderDetails('ORD-1'); // phải gọi lại nguồn thật vì đã bị invalidate
console.log(`Số lần gọi nguồn thật sau khi invalidate + tra cứu lại ORD-1: ${realServiceB.callCount}`);

console.log('\nDemo hoàn thành.\n');
