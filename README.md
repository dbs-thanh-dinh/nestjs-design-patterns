# NestJS Design Patterns

[![CI](https://github.com/dbs-thanhdc/nestjs-design-patterns/actions/workflows/ci.yml/badge.svg)](https://github.com/dbs-thanhdc/nestjs-design-patterns/actions)

Kho mẫu minh họa các **Design Pattern (GoF)** bằng TypeScript / NestJS. Mỗi pattern đều có 2 phiên bản **without-pattern** (code thô) và **with-pattern** (áp dụng pattern) trên cùng một domain để dễ so sánh trước/sau, kèm unit test và script demo riêng.

## 📌 Mục tiêu

- Hiểu rõ **các design pattern** thông qua ví dụ thực tế
- Thấy **sự khác biệt** giữa code không pattern vs áp dụng pattern
- Học cách **áp dụng pattern đúng cách** trong dự án NestJS
- Tham khảo **cấu trúc và quy ước** lập trình chuyên nghiệp

## 🎯 Domain thống nhất

Các sample dùng chung domain **Order** (đơn hàng thương mại điện tử) ở các bước khác nhau: thanh toán, tính phí vận chuyển, quản lý trạng thái... Điều này giúp dễ so sánh cách các pattern khác nhau giải quyết vấn đề trong cùng một bối cảnh quen thuộc.

## 📁 Cấu trúc thư mục

```
sample/
├── creational/
│   ├── factory/               # Xử lý thanh toán đơn hàng (Payment)
│   ├── abstract-factory/      # Xử lý đơn hàng theo khu vực (Region)
│   ├── singleton/             # Sinh mã đơn hàng (Order ID)
│   └── builder/               # Khởi tạo đơn hàng (Order)
├── structural/
│   ├── adapter/               # Tích hợp cổng thanh toán bên thứ 3
│   ├── facade/                # Quy trình checkout đơn hàng (nhiều subsystem)
│   ├── proxy/                 # Cache tra cứu chi tiết đơn hàng
│   └── decorator/             # Dịch vụ tùy chọn cho đơn hàng
└── behavioral/
    ├── strategy/              # Tính phí vận chuyển đơn hàng (Shipping)
    ├── observer/              # Thông báo đổi trạng thái đơn hàng
    ├── state/                 # Vòng đời đơn hàng
    └── command/               # Undo thao tác giỏ hàng
```

## 📊 Danh sách các Pattern

| Nhóm        | Pattern          | Ví dụ trong domain          | Thư mục                              |
|-------------|------------------|---------------------------|---------------------------------------|
| Creational  | Factory          | Thanh toán đơn hàng       | `sample/creational/factory`          |
| Creational  | Abstract Factory | Xử lý đơn hàng theo khu vực | `sample/creational/abstract-factory` |
| Creational  | Singleton        | Sinh mã đơn hàng          | `sample/creational/singleton`        |
| Creational  | Builder          | Khởi tạo đơn hàng         | `sample/creational/builder`          |
| Behavioral  | Strategy         | Tính phí vận chuyển       | `sample/behavioral/strategy`         |
| Behavioral  | Observer         | Thông báo đổi trạng thái  | `sample/behavioral/observer`         |
| Behavioral  | State            | Vòng đời đơn hàng         | `sample/behavioral/state`            |
| Behavioral  | Command          | Undo thao tác giỏ hàng    | `sample/behavioral/command`          |
| Structural  | Adapter          | Tích hợp cổng thanh toán  | `sample/structural/adapter`          |
| Structural  | Facade           | Quy trình checkout        | `sample/structural/facade`           |
| Structural  | Proxy            | Cache chi tiết đơn hàng   | `sample/structural/proxy`            |
| Structural  | Decorator        | Dịch vụ tùy chọn          | `sample/structural/decorator`        |

## 🚀 Bắt đầu

### Yêu cầu hệ thống
- **Node.js**: v18 trở lên
- **npm**: v9 trở lên

### Cài đặt

```bash
npm install
```

## 📖 Cách sử dụng

### Chạy từng pattern riêng lẻ

Mỗi pattern có script `npm run sample:<tên-pattern>` để chạy demo độc lập, không cần khởi động cả ứng dụng NestJS:

```bash
# Creational Patterns
npm run sample:factory
npm run sample:abstract-factory
npm run sample:singleton
npm run sample:builder

# Behavioral Patterns
npm run sample:strategy
npm run sample:observer
npm run sample:state
npm run sample:command

# Structural Patterns
npm run sample:adapter
npm run sample:facade
npm run sample:proxy
npm run sample:decorator
```

### Chạy toàn bộ test

```bash
npm test
```

Chạy test cho pattern cụ thể:

```bash
npx jest sample/creational/factory
```

### Khởi động ứng dụng NestJS

`src/` là ứng dụng NestJS cơ bản, không chứa logic pattern - dùng làm khung dự án chung, có thể mở rộng sau này (ví dụ: expose API demo các pattern qua HTTP).

```bash
npm run start:dev
```

## 📝 Quy ước đặt tên

- **Thư mục pattern**: `sample/<nhóm-pattern>/<tên-pattern>/`
- **File code**: `<tên-class>.<vai-trò>.ts` (ví dụ: `credit-card.processor.ts`, `standard-shipping.strategy.ts`)
- **File test**: `<chủ-đề>.spec.ts` nằm ở thư mục gốc của pattern (test cả phiên bản without/with pattern trong cùng 1 file để dễ so sánh)
- **Cấu trúc pattern**: Mỗi pattern bao gồm: `README.md`, `demo.ts`, thư mục `without-pattern/`, thư mục `with-pattern/`

## 🤝 Đóng góp pattern mới

1. Tạo thư mục `sample/<nhóm>/<tên-pattern>/`
2. Thêm `without-pattern/`, `with-pattern/`, file `.spec.ts`, `demo.ts`, `README.md` theo cấu trúc các pattern đã có
3. Thêm script `sample:<tên-pattern>` vào `package.json`
4. Cập nhật bảng danh sách ở phần 📊 Danh sách các Pattern

## 🔧 CI/CD

Mỗi push / pull request sẽ tự động chạy `lint`, `build`, `test` qua GitHub Actions (xem [.github/workflows/ci.yml](.github/workflows/ci.yml))

## 📚 Tài liệu tham khảo

- [Design Patterns: Elements of Reusable Object-Oriented Software](https://en.wikipedia.org/wiki/Design_Patterns) - Gang of Four (GoF)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 Giấy phép

MIT
