## Biểu đồ Use Case: Lịch & Sự kiện

Sơ đồ chi tiết các use case liên quan đến quản lý lịch và sự kiện.

```mermaid
flowchart TB
  %% Actors
  actorUser("👤 Người dùng đã đăng nhập")
  actorOwner("👑 Chủ board (Owner)")
  actorMember("👥 Thành viên (Member)")
  
  %% System boundary
  subgraph Calendar[Hệ thống Lịch & Sự kiện]
    UC_Calendar(("Xem Lịch tháng"))
    UC_ManageEvents(("Tạo / Sửa / Xóa Sự kiện"))
  end
  
  %% Associations - User
  actorUser --> UC_Calendar
  
  %% Associations - Owner
  actorOwner --> UC_Calendar
  actorOwner --> UC_ManageEvents
  
  %% Associations - Member
  actorMember --> UC_Calendar
  
  %% Extend relationship
  UC_Calendar -.->|extend| UC_ManageEvents
```

**Mô tả các Use Case:**

- **UC_Calendar (Xem Lịch tháng)**: Xem lịch tháng với tất cả các sự kiện đã được tạo. Hiển thị sự kiện theo ngày, có thể xem chi tiết sự kiện khi click vào. Tất cả người dùng đã đăng nhập (User, Owner, Member) đều có quyền xem lịch.

- **UC_ManageEvents (Tạo / Sửa / Xóa Sự kiện)**: 
  - Tạo sự kiện mới với thông tin: tiêu đề, mô tả, ngày bắt đầu, ngày kết thúc, thời gian, màu sắc
  - Chỉnh sửa sự kiện đã tạo
  - Xóa sự kiện
  - Đổi màu sự kiện
  - Liên kết sự kiện với board cụ thể
  Chỉ Owner mới có quyền quản lý sự kiện. Member chỉ có thể xem lịch thông qua UC_Calendar.

- **Quan hệ Extend**: `UC_ManageEvents` mở rộng `UC_Calendar` - khi Owner đang xem lịch, họ có thể mở rộng chức năng để tạo, sửa, hoặc xóa sự kiện. Đây là quan hệ **extend** vì quản lý sự kiện là tùy chọn, chỉ áp dụng cho Owner.

**Actors:**
- **Người dùng đã đăng nhập (User)**: Có quyền xem lịch tháng.
- **Chủ board (Owner)**: Có quyền xem lịch và quản lý sự kiện (tạo, sửa, xóa).
- **Thành viên (Member)**: Chỉ có quyền xem lịch, không thể quản lý sự kiện.

