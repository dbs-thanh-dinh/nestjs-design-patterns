# Adapter Pattern (Structural)

**Domain minh họa:** Tích hợp với **cổng thanh toán bên thứ ba** (`Legacy Payment
Gateway`) — SDK có sẵn, dùng đơn vị **USD cents** và tên field hoàn toàn khác quy
ước nội bộ (VND, `orderId`, `success`...). Đây là bài toán rất thực tế: bạn không
thể/không nên sửa code của thư viện bên ngoài.

## Vấn đề

Nếu code nghiệp vụ gọi thẳng SDK bên thứ ba ở nhiều nơi, logic **chuyển đổi đơn
vị + ánh xạ field** bị lặp lại từng chỗ:

```ts
// checkout()
const amountInCents = Math.round((amountInVnd / USD_TO_VND_RATE) * 100);

// retryPayment() - copy-paste lại, nhưng QUÊN Math.round()!
const amountInCents = (amountInVnd / USD_TO_VND_RATE) * 100; // có thể ra số thập phân
```

Sample này cố tình tái hiện đúng loại bug thực tế hay gặp: `retryPayment()` quên
`Math.round()`, khiến `amountInCents` là số thập phân — SDK bên thứ ba từ chối xử
lý. Đây không phải lỗi cú pháp, mà là **hệ quả của việc để logic chuyển đổi đơn vị
tồn tại ở nhiều nơi** thay vì tập trung một chỗ.

Ngoài ra, code nghiệp vụ còn bị **phụ thuộc trực tiếp** vào chi tiết implementation
của SDK bên ngoài — muốn đổi sang cổng thanh toán khác phải sửa mọi nơi đang gọi
`LegacyPaymentGatewaySdk`.

## Cách Adapter Pattern giải quyết

- Định nghĩa interface **nội bộ** `IPaymentGateway` — đại diện cho những gì hệ
  thống của chúng ta *muốn* làm việc cùng (VND, field rõ ràng).
- `PaymentGatewayAdapter` implement `IPaymentGateway`, bên trong "bọc"
  (wrap) `LegacyPaymentGatewaySdk` và làm toàn bộ việc chuyển đổi **chỉ tại một
  nơi duy nhất**.
- `CheckoutService` (code nghiệp vụ) chỉ phụ thuộc vào `IPaymentGateway` — hoàn
  toàn không biết đến sự tồn tại của SDK bên thứ ba.
- Muốn đổi sang cổng thanh toán khác (Stripe, VNPay...) chỉ cần viết 1 Adapter
  mới implement `IPaymentGateway` — không sửa `CheckoutService`.

## Lưu ý khi wiring qua NestJS DI thực tế

`IPaymentGateway` là 1 **interface** — không tồn tại lúc runtime sau khi biên
dịch sang JS, nên **không thể** `@Inject(IPaymentGateway)` trực tiếp. Cần định
nghĩa 1 DI token riêng:

```ts
export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

// trong Module:
{ provide: PAYMENT_GATEWAY, useClass: PaymentGatewayAdapter }

// trong Service:
constructor(@Inject(PAYMENT_GATEWAY) private gateway: IPaymentGateway) {}
```

Trong sample/demo/test này, adapter được truyền trực tiếp qua constructor (không
qua Nest DI container) để giữ ví dụ tập trung vào bản chất của Adapter Pattern.

## Cấu trúc

```
adapter/
├── order-payment-gateway.types.ts   # interface noi bo mong muon
├── external/
│   └── legacy-payment-gateway.sdk.ts # SDK ben thu 3, KHONG duoc sua
├── without-pattern/
│   └── checkout.without-pattern.ts
├── with-pattern/
│   ├── payment-gateway.adapter.ts
│   └── checkout.service.ts
├── payment-gateway-adapter.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:adapter
```

## Chạy test

```bash
npx jest sample/structural/adapter
```
