# Observer Pattern (Behavioral)

**Domain minh họa:** Thông báo khi **trạng thái đơn hàng thay đổi** (`Order Status
Changed`) — tiếp tục dùng chung domain `Order`. Khi đơn hàng chuyển trạng thái
(PENDING → CONFIRMED → SHIPPED → DELIVERED...), nhiều "bên liên quan" cần được báo
tin: gửi email cho khách, cập nhật tồn kho, ghi audit log...

## Vấn đề

Nếu nơi cập nhật trạng thái (`OrderStatusService`) tự gọi trực tiếp tới từng nơi
cần thông báo:

- Vi phạm **Single Responsibility** — 1 class ôm luôn logic gửi email, cập nhật
  kho, ghi log, vốn không liên quan gì đến nhau.
- Vi phạm **Open/Closed** — thêm 1 kênh thông báo mới (ví dụ: push notification)
  bắt buộc phải sửa trực tiếp vào method cập nhật trạng thái.
- Không thể bật/tắt 1 thông báo cụ thể lúc runtime (ví dụ tạm tắt audit log khi
  debug) mà không sửa code.
- Khó unit test riêng từng logic thông báo vì chúng bị trộn chung.

## Cách Observer Pattern giải quyết

- `OrderStatusPublisher` (subject) chỉ làm 2 việc: quản lý danh sách observer đã
  đăng ký (`subscribe`/`unsubscribe`) và phát sự kiện (`updateStatus`) tới **tất cả**
  observer khi trạng thái thay đổi.
- Mỗi "bên liên quan" là 1 class riêng implement `IOrderStatusObserver`, tự quyết
  định mình cần làm gì khi nhận được sự kiện — publisher hoàn toàn không biết chi
  tiết bên trong từng observer.
- Thêm 1 kênh thông báo mới chỉ cần tạo 1 class mới rồi `subscribe()` vào — không
  đụng đến publisher hay các observer cũ.
- Có thể `unsubscribe()` bất kỳ observer nào lúc runtime mà không ảnh hưởng các
  observer còn lại.

## Cấu trúc

```
observer/
├── order-status.types.ts
├── without-pattern/
│   └── order-status.without-pattern.ts
├── with-pattern/
│   ├── order-status-observer.interface.ts
│   ├── order-status.publisher.ts
│   ├── email-notifier.observer.ts
│   ├── inventory-updater.observer.ts
│   └── audit-logger.observer.ts
├── order-status.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:observer
```

## Chạy test

```bash
npx jest sample/behavioral/observer
```
