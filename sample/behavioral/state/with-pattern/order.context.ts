import { Injectable, Scope } from '@nestjs/common';
import { OrderStatus } from '../order-lifecycle.types';
import { IOrderState } from './order-state.interface';

/**
 * DUNG State Pattern.
 *
 * `OrderContext` (Context) khong tu chua bat ky quy tac chuyen trang thai nao -
 * no chi giu 1 tham chieu den state hien tai (`IOrderState`) va **uy quyen**
 * (delegate) moi hanh dong cho state do xử lý. Ban than state se goi nguoc lai
 * `order.transitionTo(newState)` khi hanh dong hop le, do do quy tac chuyen
 * trang thai duoc TAP TRUNG dung trong tung state class thay vi rai rac trong
 * Context.
 *
 * Loi ich so voi if/else:
 * - Muon biet "trang thai X lam duoc gi" chi can mo dung 1 file (vi du
 *   `confirmed.state.ts`), khong phai doc toan bo cac method cua Context.
 * - Them 1 trang thai moi (vi du: `RETURNED`) chi can tao 1 class State moi va
 *   cap nhat cac state lien quan can chuyen toi/tu trang thai do - Context
 *   hoan toan khong doi.
 * - Khong the "quen" kiem tra dieu kien vi logic nam ngay trong tung state,
 *   default la nem loi (xem BaseOrderState), chi override khi thuc su cho phep.
 *
 * `Scope.TRANSIENT`: Context giu state rieng cho TUNG don hang, khong duoc dung
 * chung 1 instance singleton cho nhieu don hang khac nhau.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class OrderContext {
  private state: IOrderState;

  constructor(
    readonly orderId: string,
    initialState: IOrderState,
  ) {
    this.state = initialState;
  }

  transitionTo(state: IOrderState): void {
    this.state = state;
  }

  get currentStatus(): OrderStatus {
    return this.state.name;
  }

  confirm(): void {
    this.state.confirm(this);
  }

  ship(): void {
    this.state.ship(this);
  }

  deliver(): void {
    this.state.deliver(this);
  }

  cancel(): void {
    this.state.cancel(this);
  }
}
