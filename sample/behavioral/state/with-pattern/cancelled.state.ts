import { OrderStatus } from '../order-lifecycle.types';
import { BaseOrderState } from './base-order.state';

export class CancelledState extends BaseOrderState {
  readonly name = OrderStatus.CANCELLED;

  // Trang thai cuoi (terminal state) - khong override bat ky hanh dong nao.
}
