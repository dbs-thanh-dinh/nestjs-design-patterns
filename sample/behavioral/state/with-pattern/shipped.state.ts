import { OrderStatus } from '../order-lifecycle.types';
import { BaseOrderState } from './base-order.state';
import { OrderContext } from './order.context';
import { DeliveredState } from './delivered.state';

export class ShippedState extends BaseOrderState {
  readonly name = OrderStatus.SHIPPED;

  deliver(order: OrderContext): void {
    order.transitionTo(new DeliveredState());
  }

  // confirm(), ship() và cancel() không được override -> tự động nêm lỗi.
  // Lưu ý: đơn đã giao cho đơn vị vận chuyển thi KHÔNG THỂ hủy nữa - day chinh
  // là 1 quy tắc nghiệp vụ quan trong ma pattern nay giúp thể hiện RÕ RÀNG ngay
  // trong định nghĩa cua ShippedState, thay vì ẩn trong 1 dieu kien if o dau do.
}
