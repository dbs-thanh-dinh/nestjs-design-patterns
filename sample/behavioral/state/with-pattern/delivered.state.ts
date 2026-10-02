import { OrderStatus } from '../order-lifecycle.types';
import { BaseOrderState } from './base-order.state';

export class DeliveredState extends BaseOrderState {
  readonly name = OrderStatus.DELIVERED;

  // Trang thai cuoi (terminal state) - khong override bat ky hanh dong nao,
  // moi hanh dong deu tu dong nem loi tu BaseOrderState.
}
