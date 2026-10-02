import { OrderStatus } from '../order-lifecycle.types';
import { BaseOrderState } from './base-order.state';
import { OrderContext } from './order.context';
import { ConfirmedState } from './confirmed.state';
import { CancelledState } from './cancelled.state';

export class PendingState extends BaseOrderState {
  readonly name = OrderStatus.PENDING;

  confirm(order: OrderContext): void {
    order.transitionTo(new ConfirmedState());
  }

  cancel(order: OrderContext): void {
    order.transitionTo(new CancelledState());
  }

  // ship() va deliver() khong duoc override -> tu dong nem loi tu BaseOrderState.
}
