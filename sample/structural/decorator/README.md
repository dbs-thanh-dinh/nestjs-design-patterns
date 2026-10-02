# Decorator Pattern (Structural)

**Domain minh họa:** Thêm **dịch vụ tùy chọn** vào đơn hàng — gói quà, bảo hiểm
vận chuyển, giao hỏa tốc — mỗi dịch vụ thêm chi phí + mô tả, khách hàng có thể
chọn **kết hợp bất kỳ** dịch vụ nào (không chọn gì, chỉ 1, hoặc cả 3...).

## Vấn đề

Nếu mỗi dịch vụ tùy chọn là 1 boolean flag, logic tính giá phải kiểm tra từng
flag bằng `if/else` trong 1 method:

```ts
calculateTotal(basePrice, { giftWrap, insurance, expressHandling }) {
  let total = basePrice;
  if (giftWrap) total += 20000;
  if (insurance) total *= 1.02;
  if (expressHandling) total += 50000;
  return total;
}
```

- `calculateTotal()` và `calculateDescription()` phải **luôn đồng bộ thủ công**
  — thêm 1 dòng ở chỗ này thì phải nhớ thêm ở chỗ kia.
- Thêm 1 dịch vụ tùy chọn mới (ví dụ: "bọc chống sốc") **bắt buộc sửa cả 2
  method** — vi phạm Open/Closed.
- **Thứ tự áp dụng dịch vụ là cố định** — không thể tùy biến cho từng đơn hàng
  cụ thể, dù trong thực tế thứ tự có thể ảnh hưởng đến kết quả (xem phần dưới).
- Số tổ hợp có thể có tăng theo cấp số nhân (2ⁿ với n dịch vụ tùy chọn).

## Cách Decorator Pattern giải quyết

- `BaseOrder` (Concrete Component) là đơn hàng ở dạng cơ bản nhất.
- `OrderDecorator` (abstract) implement **cùng interface** `IPricedOrder`, giữ
  tham chiếu đến đối tượng nó "bọc" (`wrapped`) — có thể là `BaseOrder` hoặc
  **1 decorator khác**, cho phép **xếp chồng nhiều lớp**.
- Mỗi decorator cụ thể (`GiftWrapDecorator`, `InsuranceDecorator`,
  `ExpressHandlingDecorator`) chỉ cần override và **thêm phần của riêng mình**
  vào kết quả của `super`, không cần biết gì về các decorator khác đang bao
  quanh hay nằm bên trong nó.
- Muốn kết hợp dịch vụ nào, chỉ cần **xếp chồng đúng decorator đó**:

```ts
new ExpressHandlingDecorator(
  new InsuranceDecorator(
    new GiftWrapDecorator(new BaseOrder('ORD-101', 1_000_000)),
  ),
);
```

- Thêm 1 dịch vụ mới chỉ cần viết 1 class decorator mới — **không sửa
  `BaseOrder` hay các decorator có sẵn**.

## Điểm tinh tế: thứ tự bọc có thể ảnh hưởng đến kết quả

`InsuranceDecorator` tính phí theo **% trên giá hiện tại** (bao gồm mọi
decorator đã bọc bên trong nó). Vì vậy:

```ts
// GiftWrap boc TRUOC (ben trong), Insurance boc SAU (ben ngoai):
// -> bao hiem duoc tinh % TREN CA phi goi qua
new InsuranceDecorator(new GiftWrapDecorator(new BaseOrder('X', 1_000_000)))
// = (1.000.000 + 20.000) * 1.02 = 1.040.400

// Insurance boc TRUOC, GiftWrap boc SAU:
// -> bao hiem chi tinh % tren gia goc, phi goi qua cong THEM SAU
new GiftWrapDecorator(new InsuranceDecorator(new BaseOrder('X', 1_000_000)))
// = (1.000.000 * 1.02) + 20.000 = 1.040.000
```

Đây là điều **without-pattern không thể làm được** — vì thứ tự áp dụng bị khóa
cứng trong 1 method duy nhất. Với Decorator, thứ tự bọc chính là 1 phần của
thiết kế, có thể tùy biến theo từng trường hợp.

## Cấu trúc

```
decorator/
├── order-pricing.types.ts
├── without-pattern/
│   └── order-pricing.without-pattern.ts
├── with-pattern/
│   ├── base-order.ts            # Concrete Component
│   ├── order.decorator.ts        # abstract base decorator
│   ├── gift-wrap.decorator.ts
│   ├── insurance.decorator.ts
│   └── express-handling.decorator.ts
├── order-decorator.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:decorator
```

## Chạy test

```bash
npx jest sample/structural/decorator
```
