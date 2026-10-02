# Singleton Pattern (Creational)

**Domain minh họa:** Bộ sinh mã đơn hàng (`Order ID Generator`)

## Vấn đề

Nếu `OrderIdGenerator` bị `new` ra ở nhiều nơi khác nhau trong code (ví dụ: 1 lần
trong `OrderService` khi tạo đơn từ web, 1 lần trong `ImportService` khi import đơn
từ file Excel), mỗi instance sẽ tự giữ **một bộ đếm (`sequence`) riêng biệt**, không
biết gì về các instance khác. Kết quả: có thể **sinh ra 2 mã đơn hàng trùng nhau**
dù chúng đại diện cho 2 đơn hoàn toàn khác nhau.

## Cách Singleton Pattern giải quyết

- Constructor được khai báo `private` -> không ai gọi `new OrderIdGenerator()` từ
  bên ngoài được nữa.
- Cách duy nhất để lấy instance là qua `OrderIdGenerator.getInstance()`, hàm này
  luôn trả về **cùng một instance** dù được gọi bao nhiêu lần, ở bất kỳ đâu.
- Vì chỉ có 1 instance -> chỉ có 1 bộ đếm `sequence` duy nhất -> không bao giờ sinh
  trùng ID.

## Lưu ý khi dùng trong NestJS thực tế

NestJS DI container **mặc định đã tạo Provider theo Singleton scope** (dùng chung 1
instance cho toàn app) mà không cần tự viết `static getInstance()`. Chỉ cần:

```ts
@Injectable()
export class OrderIdGenerator {
  private sequence = 0;
  generate(): string { /* ... */ }
}
```

... và khai báo trong `providers: [OrderIdGenerator]` của Module là đủ.

Sample này minh họa Singleton kiểu "thuần TypeScript" (`private constructor` +
`static getInstance()`) để hiểu **bản chất pattern**. Cách này vẫn hữu ích khi:

- Class cần dùng cả ở nơi ngoài Nest DI container (script CLI độc lập, cronjob
  không chạy trong Nest context...).
- Muốn kiểm soát chặt việc khởi tạo instance (ví dụ: lazy-init tốn kém tài
  nguyên, chỉ tạo khi thực sự cần).

## Injection Scopes trong NestJS

NestJS cung cấp **3 scope** để kiểm soát vòng đời của provider:

| Scope | Mô tả | Khi nào dùng | Lưu ý |
|-------|-------|------------|-------|
| **DEFAULT** (Singleton) | Một instance dùng chung cho toàn bộ application, khởi tạo lúc startup. | Hầu hết các trường hợp — service, repository, utility. Khuyến nghị dùng cho đa số provider. | Tốc độ nhanh nhất vì không phải khởi tạo lại. |
| **REQUEST** | Instance mới được tạo cho mỗi HTTP request, được giải phóng sau khi request xử lý xong. | Khi cần state riêng cho từng request (multi-tenancy, request tracking, request-scoped cache). | Ảnh hưởng hiệu năng (phải khởi tạo mỗi request). Scope này "bubble up" — nếu provider là REQUEST-scoped, các provider phụ thuộc nó cũng trở thành REQUEST-scoped. |
| **TRANSIENT** | Mỗi nơi inject (consumer) nhận một instance riêng — không share giữa các consumer. | Khi cần cách ly hoàn toàn instance hoặc provider có state không được phép share. | Chiếm tài nguyên cao, dùng khi thực sự cần. |

**Cách khai báo:**

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {}

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {}

// DEFAULT (không cần chỉ định)
@Injectable()
export class SingletonService {}
```

Với `OrderIdGenerator` trong sample này, **DEFAULT (Singleton)** là lựa chọn hoàn hảo — cần 1 bộ đếm duy nhất dùng chung toàn ứng dụng, không phải per-request.

## Cấu trúc

```
singleton/
├── order-id-generator.types.ts
├── without-pattern/
│   └── order-id-generator.without-pattern.ts
├── with-pattern/
│   └── order-id-generator.singleton.ts
├── order-id-generator.spec.ts
├── demo.ts
└── README.md
```

## Chạy thử

```bash
npm run sample:singleton
```

## Chạy test

```bash
npx jest sample/creational/singleton
```
