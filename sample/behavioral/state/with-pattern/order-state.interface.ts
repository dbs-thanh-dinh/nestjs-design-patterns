import { OrderStatus } from '../order-lifecycle.types';
import { OrderContext } from './order.context';

/**
 * Moi trang thai deu implement du ca 4 hanh dong, NHUNG chi trang thai nao cho
 * phep hanh dong do moi thuc su chuyen sang trang thai ke tiep. Cac hanh dong
 * khong hop le se nem loi ngay tai chinh state hien tai (xem BaseOrderState).
 */
export interface IOrderState {
  readonly name: OrderStatus;
  confirm(order: OrderContext): void;
  ship(order: OrderContext): void;
  deliver(order: OrderContext): void;
  cancel(order: OrderContext): void;
}
