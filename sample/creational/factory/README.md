# Factory Pattern (Creational)

**Domain minh họa:** Xử lý thanh toán dơn hàng (`Order Payment`) với nhiều phương thức thanh toán: Credit Card, PayPal, Bank Transfer.

## Van de

Khi số lượng phương thức thanh toán tăng lên, logic tạo & xử lý từng loại payment dễ bị
dồn hết vào 1 method dài với hàng loạt `if/else`, vi phạm nguyên tắc **Open/Closed** (mở để
mở rộng, dóng để sửa đổi): mỗi lần thêm phương thức mới là phải sửa code cũ, dễ gây bug ở
các nhánh khác.

## Cách Factory Pattern giải quyết

- Định nghĩa 1 interface chung `IPaymentProcessor`.
- Mọi phương thức thanh toán là 1 class riêng implement interface.
- `PaymentProcessorFactory` chỉ làm 1 việc: nhận `PaymentMethod`, trả về đúng `IPaymentProcessor`.
- Muốn thêm phương thức mới -> tạo class mới + đăng ký vào factory, **không động đến
  code cũ**.

## Cấu trúc

```
factory/
├── order-payment.types.ts        # domain type dung chung
├── without-pattern/
│   └── payment-processor.without-pattern.ts
├── with-pattern/
│   ├── payment-processor.interface.ts
│   ├── credit-card.processor.ts
│   ├── paypal.processor.ts
│   ├── bank-transfer.processor.ts
│   └── payment-processor.factory.ts
├── payment-processor.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:factory
```

## Chạy test

```bash
npx jest sample/creational/factory
```
