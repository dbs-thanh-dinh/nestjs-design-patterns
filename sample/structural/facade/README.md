# Facade Pattern (Structural)

**Domain minh họa:** Quy trình **checkout đơn hàng** hoàn chỉnh — cần phối hợp
**4 subsystem** theo đúng thứ tự: giữ tồn kho → thu tiền → lên lịch giao hàng →
gửi email xác nhận, kèm logic **rollback** khi 1 bước thất bại.

## Phân biệt với Adapter (xem thêm `sample/structural/adapter`)

Facade và Adapter đều "đứng giữa" client code và code khác, nhưng mục đích khác
nhau:

| | Adapter | Facade |
|---|---|---|
| Số hệ thống đứng sau | 1 (hệ thống có sẵn, interface không khớp) | Nhiều (nhiều subsystem, mỗi cái 1 việc) |
| Mục tiêu | **Chuyển đổi** interface không tương thích thành interface mong muốn | **Đơn giản hóa** cách gọi nhiều subsystem phức tạp thành 1 lời gọi |
| Interface của hệ thống bên dưới | Giữ nguyên, chỉ "dịch" lại | Các subsystem vẫn giữ nguyên API riêng, Facade không thay thế chúng |

## Vấn đề

Nếu mỗi nơi cần checkout (web, trang admin tạo đơn thủ công, mobile app...) đều tự
gọi trực tiếp cả 4 subsystem:

```ts
const reserved = inventory.reserveStock(items);
if (!reserved) return { success: false, failedStep: 'inventory' };

const paymentResult = payment.charge(orderId, totalAmount);
if (!paymentResult.success) {
  inventory.releaseStock(items); // rollback - PHẢI TỰ NHỚ viết ở đây
  return { success: false, failedStep: 'payment' };
}

const shipmentResult = shipping.scheduleShipment(orderId, address);
notification.sendOrderConfirmation(orderId, email, shipmentResult.trackingCode);
```

Sample này tái hiện đúng bug thực tế hay gặp: code checkout từ **web** nhớ
rollback tồn kho khi thanh toán thất bại, nhưng code tạo đơn thủ công từ
**admin** (được viết sau, copy-paste lại logic) lại **quên mất bước rollback** —
tồn kho bị giữ nhầm vĩnh viễn cho một đơn hàng không bao giờ thành công.

## Cách Facade Pattern giải quyết

- `OrderCheckoutFacade` cung cấp **1 method duy nhất** — `placeOrder()` — cho mọi
  nơi cần checkout gọi tới.
- Toàn bộ logic điều phối (đúng thứ tự gọi 4 subsystem) và logic **rollback**
  chỉ tồn tại ở **1 nơi duy nhất** bên trong facade.
- Bất kỳ nơi nào cần checkout chỉ cần gọi `placeOrder()` — không cần biết có
  bao nhiêu subsystem, thứ tự gọi ra sao, hay khi nào cần rollback.
- Các subsystem (`InventorySubsystem`, `PaymentSubsystem`...) **vẫn giữ nguyên**
  API riêng của chúng — Facade không thay thế subsystem, chỉ đơn giản hóa **cách
  gọi chúng**. Ai cần dùng trực tiếp 1 subsystem cụ thể (ví dụ: chỉ kiểm tra tồn
  kho mà không checkout) vẫn gọi thẳng được, không bị Facade che khuất.

## Cấu trúc

```
facade/
├── order-checkout.types.ts
├── subsystems/
│   ├── inventory.subsystem.ts
│   ├── payment.subsystem.ts
│   ├── shipping.subsystem.ts
│   └── notification.subsystem.ts
├── without-pattern/
│   └── checkout.without-pattern.ts   # 2 nơi gọi, 1 nơi quên rollback
├── with-pattern/
│   └── order-checkout.facade.ts
├── order-checkout-facade.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:facade
```

## Chạy test

```bash
npx jest sample/structural/facade
```
