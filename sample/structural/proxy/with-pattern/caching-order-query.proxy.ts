import { Injectable } from '@nestjs/common';
import { IOrderQueryService, OrderDetails } from '../order-query.types';
import { RealOrderQueryService } from '../real-order-query.service';

/**
 * DUNG Proxy Pattern (Caching Proxy).
 *
 * `CachingOrderQueryProxy` implement CÙNG interface `IOrderQueryService` như
 * `RealOrderQueryService` - nguồn gọi hoàn toàn KHÔNG PHÂN BIỆT được đang làm
 * việc với nguồn thật hay proxy, chỉ biết gọi `getOrderDetails(orderId)`.
 *
 * Ở bên trong, proxy kiểm tra cache TRƯỚC KHI quyết định có gọi tới
 * `RealOrderQueryService` (nguồn dữ liệu) hay không:
 * - Nếu đã có trong cache -> trả về ngay, KHÔNG gọi nguồn thật.
 * - Nếu chưa có -> gọi nguồn thật 1 LẦN, lưu vào cache, rồi trả về.
 *
 * Lợi ích so với tự viết cache riêng lẻ ở từng nơi:
 * - Mỗi consumer dùng CHUNG 1 proxy -> cache được CHIA SẺ giữa tất cả, không
 *   còn tình trạng 2 nơi cũng tra cứu 1 đơn hàng nhưng không biết về nhau.
 * - Logic cache CHỈ TỒN TẠI ở 1 nơi duy nhất - để kiểm soát, để đổi chiến
 *   lược (ví dụ: thêm TTL, giới hạn kích thước cache) mà không ảnh hưởng code
 *   nghiệp vụ đang sử dụng `IOrderQueryService`.
 * - Code nghiệp vụ (nơi gọi `getOrderDetails()`) hoàn toàn không đổi dù bản
 *   dưới đang dùng `RealOrderQueryService` trực tiếp hay đang đi qua proxy -
 *   đây chính là tính "trong suốt" đặc trưng của Proxy Pattern.
 */
@Injectable()
export class CachingOrderQueryProxy implements IOrderQueryService {
  private readonly cache = new Map<string, OrderDetails>();

  constructor(private readonly realService: RealOrderQueryService) {}

  getOrderDetails(orderId: string): OrderDetails {
    const cached = this.cache.get(orderId);
    if (cached) {
      return cached;
    }

    const result = this.realService.getOrderDetails(orderId);
    this.cache.set(orderId, result);
    return result;
  }

  /** Xóa cache của 1 đơn hàng cụ thể - dùng khi dữ liệu đơn hàng đó vừa thay đổi. */
  invalidate(orderId: string): void {
    this.cache.delete(orderId);
  }

  /** Xóa toàn bộ cache. */
  clearCache(): void {
    this.cache.clear();
  }

  get cacheSize(): number {
    return this.cache.size;
  }
}
