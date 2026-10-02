import { Injectable } from '@nestjs/common';
import { IOrderQueryService, OrderDetails } from './order-query.types';

/**
 * "Real Subject" trong Proxy Pattern - nơi THỰC SỰ chứa logic truy vấn TỒN KÉM
 * chỉ phí (ở đây giả lập bằng 1 "database" trong bộ nhớ, nhưng đại diện cho
 * trường hợp thực tế: truy vấn database phức tạp, gọi API bên ngoài có độ trễ
 * cao, hoặc tính toán nặng...).
 *
 * `callCount` dùng để MINH HỌA và KIỂM CHỨNG trong test/demo: mỗi lần
 * `callCount` tăng lên nghĩa là 1 lần "trả giá" cho thao tác tồn kém này.
 */
@Injectable()
export class RealOrderQueryService implements IOrderQueryService {
  callCount = 0;

  private readonly database = new Map<string, OrderDetails>([
    ['ORD-1', { orderId: 'ORD-1', customerName: 'Nguyen Van A', totalAmount: 1500000 }],
    ['ORD-2', { orderId: 'ORD-2', customerName: 'Tran Thi B', totalAmount: 2300000 }],
  ]);

  getOrderDetails(orderId: string): OrderDetails {
    this.callCount += 1;
    const order = this.database.get(orderId);
    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng ${orderId}`);
    }
    return order;
  }
}
