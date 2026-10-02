# State Pattern (Behavioral)

**Domain minh họa:** Vòng đời (lifecycle) đơn hàng — `PENDING → CONFIRMED → SHIPPED
→ DELIVERED`, hoặc `PENDING/CONFIRMED → CANCELLED`. Hành động nào được phép thực
hiện, và trạng thái kế tiếp là gì, phụ thuộc hoàn toàn vào **trạng thái hiện tại**
của đơn hàng.

## Phân biệt với Strategy (xem thêm `sample/behavioral/strategy`)

State và Strategy có cấu trúc code gần giống nhau (đều là 1 interface + nhiều
implementation + 1 context giữ tham chiếu tới implementation hiện tại), nhưng
**mục đích khác nhau**:

| | Strategy | State |
|---|---|---|
| Ai chọn implementation? | Người gọi từ bên ngoài (`setStrategy()`) | **Chính bản thân implementation hiện tại tự chuyển** sang implementation kế tiếp (`order.transitionTo(new ConfirmedState())`) |
| Các implementation có biết nhau không? | Không, độc lập hoàn toàn | Có — mỗi state biết state nào là hợp lệ để chuyển tới |
| Trạng thái đổi theo | Không có khái niệm "trạng thái" — chỉ đổi *thuật toán* | Vòng đời (lifecycle) — trạng thái đổi theo *thời gian/sự kiện* |

## Vấn đề

Nếu để 1 class ôm hết logic của mọi hành động (`confirm`, `ship`, `deliver`,
`cancel`) và mỗi method tự kiểm tra trạng thái hiện tại bằng `if/else`:

- Quy tắc chuyển trạng thái bị **rải rác** khắp 4 method thay vì tập trung theo
  từng trạng thái — muốn biết "ở trạng thái X thì làm được gì" phải đọc cả 4
  method và lọc ra từng nhánh liên quan.
- Số nhánh điều kiện tăng theo cấp số nhân khi thêm trạng thái/hành động mới —
  rất dễ sót trường hợp, dễ quên cập nhật.

## Cách State Pattern giải quyết

- Mỗi trạng thái là 1 class riêng implement `IOrderState`, chỉ **override đúng
  hành động mà trạng thái đó thực sự cho phép** (nhờ `BaseOrderState` mặc định
  ném lỗi cho mọi hành động chưa được override).
- `OrderContext` (Context) không chứa bất kỳ quy tắc nào — chỉ giữ tham chiếu tới
  state hiện tại và **ủy quyền** mọi hành động cho state đó xử lý.
- Chính state sẽ gọi `order.transitionTo(newState)` khi hành động hợp lệ — quy
  tắc chuyển trạng thái nằm gọn trong từng state, không rải rác trong Context.
- Ví dụ: `ShippedState` không override `cancel()` → gọi `cancel()` khi đơn đã
  `SHIPPED` sẽ tự động báo lỗi rõ ràng, không cần viết `if` nào cả.

## Cấu trúc

```
state/
├── order-lifecycle.types.ts
├── without-pattern/
│   └── order-lifecycle.without-pattern.ts
├── with-pattern/
│   ├── order-state.interface.ts
│   ├── base-order.state.ts
│   ├── order.context.ts
│   ├── pending.state.ts
│   ├── confirmed.state.ts
│   ├── shipped.state.ts
│   ├── delivered.state.ts
│   └── cancelled.state.ts
├── order-state.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:state
```

## Chạy test

```bash
npx jest sample/behavioral/state
```
