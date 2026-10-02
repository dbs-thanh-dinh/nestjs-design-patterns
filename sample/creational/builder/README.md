# Builder Pattern (Creational)

**Domain minh họa:** Khởi tạo đối tượng **`Order`** — đơn hàng có nhiều trường bắt
buộc (mã đơn, khách hàng, danh sách sản phẩm, địa chỉ giao) và nhiều trường tùy
chọn (mã giảm giá, gói quà, ghi chú)

## Vấn đề

Khi 1 đối tượng có nhiều trường, nhất là nhiều trường **tùy chọn (optional)**, cách
làm "constructor nhận hết mọi tham số" rất dễ rơi vào tình trạng **telescoping
constructor**:
>telescoping constructor xảy ra khi một lớp có nhiều thuộc tính tùy chọn (optional attributes) và nhà phát triển tạo ra một chuỗi các hàm khởi tạo (constructors) lồng nhau, trong đó mỗi constructor mới lại nhận thêm tham số so với constructor trước đó.

```ts
new OrderWithoutPattern(
  'ORD-100',
  'Nguyen Van A',
  items,
  address,
  undefined, // discountCode - phải truyền undefined dư không dùng
  true,      // giftWrap - nhìn vào đây không biết là gì nếu không xem constructor
  'Giao gio hanh chinh',
);
```

- Dễ **truyền nhầm vị trí** các tham số cùng kiểu (đặc biệt là nhiều `boolean`,
  `string` liên tiếp).
- Muốn thêm 1 trường tùy chọn mới -> phải sửa chữ ký constructor, ảnh hưởng mọi nơi
  đang gọi.
- Code gọi hàm không tự giải thích được — phải mở definition mới biết tham số nào
  là gì.

## Cách Builder Pattern giải quyết

- `OrderBuilder` cung cấp các method có **tên rõ ràng** để set từng trường:
  `withOrderId()`, `withCustomer()`, `addItem()`, `applyDiscountCode()`,
  `markAsGiftWrap()`...
- Mỗi method trả về `this` -> gọi nối tiếp nhau (**fluent interface**), thứ tự gọi
  không quan trọng.
- `build()` kiểm tra các trường bắt buộc trước khi tạo `Order`, báo lỗi rõ ràng nếu
  thiếu.
- Thêm 1 trường tùy chọn mới chỉ cần thêm 1 method mới vào builder, không ảnh hưởng
  code cũ.

## Lưu ý khi dùng builder qua NestJS DI

Builder **giữ state** qua từng lần gọi method (`items`, `discountCode`...), nên
**không thể** dùng Singleton scope (mặc định của Nest) nếu inject qua DI container —
nếu không, state của request này sẽ lẫn sang request khác. Sample này khai báo
`@Injectable({ scope: Scope.TRANSIENT })` để mỗi lần resolve là 1 instance sạch.
Trong demo/test, ta vẫn dùng trực tiếp `new OrderBuilder()` — tương đương transient.

## Cấu trúc

```
builder/
├── order.types.ts
├── without-pattern/
│   └── order.without-pattern.ts
├── with-pattern/
│   └── order.builder.ts
├── order-builder.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:builder
```

## Chạy test

```bash
npx jest sample/creational/builder
```
