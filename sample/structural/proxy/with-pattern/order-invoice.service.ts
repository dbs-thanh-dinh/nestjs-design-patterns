import { IOrderQueryService } from '../order-query.types';

/**
 * Consumer này CHI phu thuoc vào interface `IOrderQueryService` - hoan toàn
 * không biet ben dưới dang dùng `RealOrderQueryService` trực tiếp hay
 * `CachingOrderQueryProxy`. Day chỉnh la minh chung ro rang nhat cho tinh
 * "trong suot" cũa Proxy Pattern.
 */
export class OrderInvoiceService {
  constructor(private readonly orderQueryService: IOrderQueryService) {}

  getOrderForInvoice(orderId: string) {
    return this.orderQueryService.getOrderDetails(orderId);
  }
}
