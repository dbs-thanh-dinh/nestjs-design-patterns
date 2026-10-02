import { OrderStatusChangedEvent } from '../order-status.types';

export interface IOrderStatusObserver {
  onOrderStatusChanged(event: OrderStatusChangedEvent): void;
}
