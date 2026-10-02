import { OrderStatus } from '../order-lifecycle.types';
import { BaseOrderState } from './base-order.state';
import { OrderContext } from './order.context';
import { ShippedState } from './shipped.state';
import { CancelledState } from './cancelled.state';

export class ConfirmedState extends BaseOrderState {
  readonly name = OrderStatus.CONFIRMED;

  ship(order: OrderContext): void {
    order.transitionTo(new ShippedState());
  }

  cancel(order: OrderContext): void {
    order.transitionTo(new CancelledState());
  }

  // confirm() và deliver() không được override -> tự động nêm lỗi tu BaseOrderState.
}
