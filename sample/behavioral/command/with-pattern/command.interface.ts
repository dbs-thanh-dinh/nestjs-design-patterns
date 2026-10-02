/**
 * Mỗi hành động đều được gọi lại thành 1 object implement `ICommand`, với 2
 * method ĐỒNG NHẤT: `execute()` để thực thi, `undo()` để hoàn tác. Invoker chỉ
 * cần biết 2 method này - hoàn toàn không quan tâm bên trong từng command làm
 * gì cụ thể.
 */
export interface ICommand {
  execute(): void;
  undo(): void;
  /** Mô tả ngắn gọn, dùng để hiển thị lịch sử thao tác cho người dùng/audit log. */
  describe(): string;
}
