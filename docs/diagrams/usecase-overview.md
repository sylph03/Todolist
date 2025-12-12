## Biểu đồ Use Case tổng quan

Sơ đồ khái quát tác nhân và các ca sử dụng chính của hệ thống Kanban Todo.

```mermaid
flowchart TB
  %% Actors
  actorGuest("Khách (Chưa đăng nhập)")
  actorUser("Người dùng đã đăng nhập")
  actorOwner("Chủ board (Owner)")
  actorMember("Thành viên (Member)")

  %% System boundary
  subgraph System[Hệ thống Quản lý Công việc Kanban]
    %% Auth
    UC_Auth(("Đăng ký / Đăng nhập"))
    UC_Verify(("Xác thực Email"))
    UC_Refresh(("Làm mới Token"))
    UC_SignOut(("Đăng xuất"))

    %% Boards & global
    UC_ViewBoards(("Xem danh sách Boards"))
    UC_Recent(("Xem gần đây"))
    UC_Starred(("Đánh dấu Yêu thích"))
    UC_Search(("Tìm kiếm & Lọc"))
    UC_Settings(("Cài đặt tài khoản & bảo mật"))

    %% Board management
    UC_CreateBoard(("Tạo / Sửa / Xóa Board"))
    UC_Invite(("Mời thành viên Board"))
    UC_BoardWIP(("Cấu hình WIP & Tùy chọn Board"))
    UC_LeaveBoard(("Rời khỏi Board"))

    %% Columns & Cards
    UC_ManageColumns(("Tạo / Sắp xếp / Sửa / Xóa Cột"))
    UC_MoveCards(("Di chuyển Thẻ (trong/between columns)"))
    UC_ManageCards(("Tạo / Sửa / Xóa Thẻ"))
    UC_CardDetails(("Chi tiết Thẻ (Markdown, cover, thành viên, hạn)"))

    %% Calendar & Events
    UC_Calendar(("Xem Lịch tháng"))
    UC_ManageEvents(("Tạo / Sửa / Xóa Sự kiện, đổi màu, liên kết Board"))

    %% AI, Notifications, Realtime
    UC_AISuggest(("AI gợi ý nhiệm vụ"))
    UC_Notifications(("Thông báo real-time"))
    UC_Realtime(("Cập nhật real-time (Socket.IO)"))
    UC_OnlineUsers(("Hiển thị thành viên online"))
  end

  %% Associations - Guest
  actorGuest --> UC_Auth
  UC_Auth -.-> UC_Verify
  UC_Auth -.-> UC_Refresh
  UC_Auth -.-> UC_SignOut

  %% Associations - Authenticated user (mọi người dùng sau đăng nhập)
  actorUser --> UC_ViewBoards
  actorUser --> UC_Recent
  actorUser --> UC_Starred
  actorUser --> UC_Search
  actorUser --> UC_Settings
  actorUser --> UC_Calendar
  actorUser --> UC_Notifications
  actorUser --> UC_AISuggest

  %% Owner permissions
  actorOwner --> UC_CreateBoard
  actorOwner --> UC_Invite
  actorOwner --> UC_BoardWIP
  actorOwner --> UC_ManageColumns
  actorOwner --> UC_ManageCards
  actorOwner --> UC_MoveCards
  actorOwner --> UC_CardDetails
  actorOwner --> UC_ManageEvents

  %% Member permissions (hạn chế hơn Owner)
  actorMember --> UC_ViewBoards
  actorMember --> UC_Starred
  actorMember --> UC_MoveCards
  actorMember --> UC_ManageCards
  actorMember --> UC_CardDetails
  actorMember --> UC_LeaveBoard
  actorMember --> UC_Calendar
  actorMember --> UC_Notifications
  actorMember --> UC_AISuggest

  %% Include/Extend (mối quan hệ nội bộ)
  UC_CreateBoard --> UC_Realtime
  UC_Invite --> UC_Realtime
  UC_BoardWIP --> UC_Realtime
  UC_ManageColumns --> UC_Realtime
  UC_ManageCards --> UC_Realtime
  UC_MoveCards --> UC_Realtime
  UC_ManageEvents --> UC_Realtime
  UC_LeaveBoard --> UC_Realtime
  UC_Realtime --> UC_OnlineUsers
  UC_AISuggest -.-> UC_ManageCards
  UC_Calendar -.-> UC_ManageEvents
```

**Ghi chú quyền hạn chính:**
- `UC_ManageEvents` chỉ khả dụng cho `actorOwner`; `actorMember` chỉ truy cập lịch thông qua `UC_Calendar`.
- `UC_MoveCards` hỗ trợ cả Owner và Member, nhưng quản lý cột (`UC_ManageColumns`) chỉ Owner được phép.
- Đánh dấu yêu thích board (`UC_Starred`) được lưu theo từng người dùng, áp dụng cho Owner và Member.
- Sự kiện realtime (`UC_Realtime`) tự động thông báo Owner khi Member rời board, đồng thời cập nhật danh sách người dùng online (`UC_OnlineUsers`).
- `UC_BoardWIP` (Cấu hình WIP) là một use case riêng biệt mặc dù về mặt kỹ thuật sử dụng cùng API cập nhật board. Nó có UI riêng (modal), logic validation riêng (kiểm tra số lượng card), và mục đích nghiệp vụ riêng (quản lý giới hạn công việc). Chỉ Owner mới được phép cấu hình WIP.

Gợi ý chèn vào báo cáo: nhúng file hoặc copy đoạn code Mermaid vào công cụ hỗ trợ Mermaid; có thể chuyển sang PlantUML nếu cần.


