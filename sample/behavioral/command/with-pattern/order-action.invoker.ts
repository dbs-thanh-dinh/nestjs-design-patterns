import { Injectable, Scope } from '@nestjs/common';
import { ICommand } from './command.interface';

/**
 * DÙNG Command Pattern.
 *
 * `OrderActionInvoker` (Invoker) CHỈ làm 2 việc:
 * 1) Thực thi 1 `ICommand` bất kỳ và đẩy vào lịch sử (`history`).
 * 2) Undo hành động gần nhất bằng cách lấy command cuối trong `history` và gọi
 *    `undo()` của CHÍNH command đó.
 *
 * Invoker hoàn toàn KHÔNG BIẾT và KHÔNG CẦN BIẾT bên trong từng command làm gì
 * (thêm sản phẩm, xóa sản phẩm, hay bất kỳ loại hành động nào trong tương lai) -
 * nó chỉ gọi qua interface `ICommand` đồng nhất.
 *
 * Lợi ích so với cách làm thủ công (switch/if trong `undoLast`):
 * - Thêm 1 loại hành động mới (ví dụ: `UpdateQuantityCommand`) chỉ cần tạo 1
 *   class Command mới implement `ICommand` - KHÔNG động đến Invoker.
 * - Logic undo của từng hành động nằm NGAY TRONG chính command đó, không bị
 *   tách rời khỏi nơi thực thi hành động.
 * - Dễ dàng mở rộng thêm tính năng: xếp hàng đợi lệnh (queue), ghi log lịch sử
 *   thao tác (dùng `describe()`), hay "redo" (thực thi lại command đã undo).
 */
@Injectable({ scope: Scope.TRANSIENT })
export class OrderActionInvoker {
  private readonly history: ICommand[] = [];

  execute(command: ICommand): void {
    command.execute();
    this.history.push(command);
  }

  undoLast(): boolean {
    const lastCommand = this.history.pop();
    if (!lastCommand) return false;
    lastCommand.undo();
    return true;
  }

  getHistoryDescriptions(): string[] {
    return this.history.map((command) => command.describe());
  }

  get historyLength(): number {
    return this.history.length;
  }
}
