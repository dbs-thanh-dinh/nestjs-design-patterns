# Command Pattern (Behavioral)

**Domain minh họa:** Giỏ hàng (`Order Cart`) trước khi checkout — thêm sản phẩm,
xóa sản phẩm, áp dụng mã giảm giá, kèm khả năng **undo (hoàn tác)** thao tác gần
nhất.

## Vấn đề

Nếu mỗi thao tác chỉ là 1 method gọi trực tiếp thay đổi state, muốn có **undo**
thì buộc phải tự ghi log hành động (dạng chuỗi + dữ liệu thô) và viết logic đảo
ngược cho từng loại hành động ngay trong 1 method `undoLast()` bằng `switch/if`:

```ts
undoLast(): void {
  const lastAction = this.actionLog.pop();
  if (lastAction.type === 'ADD_ITEM') { /* ... */ }
  else if (lastAction.type === 'REMOVE_ITEM') { /* ... */ }
  else if (lastAction.type === 'APPLY_DISCOUNT') { /* ... */ }
}
```

- Thêm 1 loại hành động mới (ví dụ: đổi số lượng sản phẩm) **bắt buộc sửa 2
  chỗ**: method thực hiện hành động VÀ nhánh `switch` trong `undoLast()` — vi
  phạm Open/Closed.
- Logic ghi log hành động bị trộn lẫn với logic nghiệp vụ, khó đọc, khó test
  riêng lẻ.
- Không có 1 định dạng object thống nhất cho mọi hành động nên khó mở rộng thêm
  tính năng như xếp hàng đợi lệnh (queue), audit log, hay "redo".

## Cách Command Pattern giải quyết

- Mỗi hành động được gói lại thành **1 object** implement `ICommand` với 2
  method đồng nhất: `execute()` và `undo()`.
- `OrderCart` (**Receiver**) chỉ chứa logic nghiệp vụ thuần túy, hoàn toàn không
  biết gì về khái niệm Command/undo.
- `OrderActionInvoker` (**Invoker**) chỉ làm 2 việc: thực thi 1 `ICommand` bất kỳ
  và đẩy vào lịch sử; undo bằng cách lấy command cuối trong lịch sử và gọi
  `undo()` của **chính command đó** — Invoker không cần biết bên trong command
  làm gì.
- Mỗi command **tự chịu trách nhiệm lưu dữ liệu cần thiết để undo chính nó** —
  ví dụ `RemoveItemCommand` tự nhớ item đã xóa và vị trí của nó để `undo()` chèn
  lại đúng chỗ.
- Thêm 1 loại hành động mới chỉ cần tạo 1 class Command mới — **không đụng đến
  Invoker hay các command khác**.

## Cấu trúc

```
command/
├── order-cart.types.ts
├── without-pattern/
│   └── order-cart.without-pattern.ts
├── with-pattern/
│   ├── command.interface.ts
│   ├── order-cart.ts              # Receiver
│   ├── add-item.command.ts
│   ├── remove-item.command.ts
│   ├── apply-discount.command.ts
│   └── order-action.invoker.ts     # Invoker
├── order-command.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:command
```

## Chạy test

```bash
npx jest sample/behavioral/command
```
