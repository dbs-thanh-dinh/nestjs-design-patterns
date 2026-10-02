# Abstract Factory Pattern (Creational)

**Domain minh họa:** Xử lý đơn hàng theo **khu vực thị trường** (`Order Region`) —
Việt Nam / Mỹ. Mỗi khu vực cần một **bộ quy tắc đi cùng nhau**: cách tính thuế +
cách format hóa đơn. Hai thứ này phải luôn đồng bộ theo cùng 1 khu vực.

## Phân biệt với Factory Method (xem thêm `sample/creational/factory`)

| | Factory Method | Abstract Factory |
|---|---|---|
| Trả về | 1 object thuộc 1 loại sản phẩm | 1 factory tạo ra **nhiều** object thuộc **nhiều loại** sản phẩm liên quan |
| Mục tiêu | Tách logic chọn class khỏi nơi dùng | Đảm bảo các object tạo ra **tương thích, đồng bộ** với nhau |
| Số "họ sản phẩm" | 1 | ≥ 2 (mỗi factory con đại diện 1 họ) |

Factory Method trả lời *"tạo cái gì?"*; Abstract Factory trả lời *"tạo cả một bộ
đồng bộ với nhau như thế nào?"*. Trong sample này, `VietnamOrderFactory` và
`UsOrderFactory` mỗi cái đóng vai trò như 1 "Factory Method tổng hợp", cùng
implement chung interface `IRegionOrderFactory`.

## Vấn đề

Nếu tách rời tax calculator và invoice formatter thành 2 tham số độc lập, không có
gì ràng buộc chúng phải cùng khu vực:

```ts
processOrderWithoutPattern(
  'ORD-2', 1000000, OrderRegion.VIETNAM,
  new VietnamTaxCalculatorWithoutPattern(), // thue VN
  new UsInvoiceFormatterWithoutPattern(),   // nhung hoa don lai la mau US!
);
```

TypeScript **không báo lỗi biên dịch** vì cả 2 tham số đều "hợp kiểu dữ liệu" — chỉ
là **sai về nghiệp vụ**: thuế tính đúng 10% VAT nhưng số hóa đơn và footer lại theo
mẫu Mỹ. Đây là loại bug rất khó phát hiện qua code review vì không có lỗi cú pháp
hay type nào cả.

## Cách Abstract Factory Pattern giải quyết

- `IRegionOrderFactory` khai báo khởi tạo **cả họ sản phẩm** (`createTaxCalculator()`
  + `createInvoiceFormatter()` + `getRegion()`) trong cùng 1 interface.
- `VietnamOrderFactory` / `UsOrderFactory` implement interface đó, đảm bảo 2 thành
  viên trả về **luôn cùng 1 khu vực**. Mỗi factory cũng implement `getRegion()` để
  trả về region tương ứng.
- `processOrderWithFactory()` chỉ nhận **1 tham số factory duy nhất**, **không nhận
  tham số region riêng** — region được lấy từ `factory.getRegion()` để đảm bảo
  luôn đồng bộ. Về mặt thiết kế, không còn cách nào để truyền nhầm region với factory.
- Thêm 1 khu vực mới (vd: `EU`) chỉ cần tạo 1 class mới implement
  `IRegionOrderFactory` + đăng ký vào `RegionOrderFactoryProvider`, không đụng đến
  code khu vực cũ.

## Cấu trúc

```
abstract-factory/
├── region-order.types.ts
├── without-pattern/
│   └── region-order.without-pattern.ts
├── with-pattern/
│   ├── tax-calculator.interface.ts
│   ├── invoice-formatter.interface.ts
│   ├── region-order-factory.interface.ts
│   ├── vietnam-tax-calculator.ts
│   ├── vietnam-invoice-formatter.ts
│   ├── vietnam-order-factory.ts
│   ├── us-tax-calculator.ts
│   ├── us-invoice-formatter.ts
│   ├── us-order-factory.ts
│   └── region-order-factory.provider.ts
├── region-order-factory.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:abstract-factory
```

## Chạy test

```bash
npx jest sample/creational/abstract-factory
```
