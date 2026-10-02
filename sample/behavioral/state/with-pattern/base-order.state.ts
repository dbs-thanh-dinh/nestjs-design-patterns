import { OrderStatus } from '../order-lifecycle.types';
import { IOrderState } from './order-state.interface';
import { OrderContext } from './order.context';

/**
 * Base class giup cac state con KHONG PHAI viet lai logic "nem loi" cho tung
 * hanh dong khong hop le - chi can override dung method nao ma trang thai do
 * THUC SU cho phep.
 */
export abstract class BaseOrderState implements IOrderState {
  abstract readonly name: OrderStatus;

  confirm(_order: OrderContext): void {
    this.throwInvalidAction('confirm');
  }

  ship(_order: OrderContext): void {
    this.throwInvalidAction('ship');
  }

  deliver(_order: OrderContext): void {
    this.throwInvalidAction('deliver');
  }

  cancel(_order: OrderContext): void {
    this.throwInvalidAction('cancel');
  }

  protected throwInvalidAction(action: string): never {
    throw new Error(`Khong the thuc hien "${action}" khi don hang dang o trang thai ${this.name}`);
  }
}
