# SLIDE THUYẾT TRÌNH ĐỒ ÁN
## XÂY DỰNG ỨNG DỤNG WEB QUẢN LÝ CÔNG VIỆC THEO MÔ HÌNH KANBAN

---

## SLIDE 1: TRANG BÌA
# XÂY DỰNG ỨNG DỤNG WEB QUẢN LÝ CÔNG VIỆC THEO MÔ HÌNH KANBAN

**Sinh viên thực hiện:** [Tên sinh viên]  
**Giảng viên hướng dẫn:** [Tên giảng viên]  
**Ngày trình bày:** [Ngày]

---

## SLIDE 2: MỞ ĐẦU / PHÁT BIỂU BÀI TOÁN

### Vấn đề thực tế

- **Nhu cầu quản lý công việc ngày càng tăng**
  - Cá nhân và nhóm cần công cụ quản lý công việc hiệu quả
  - Mô hình Kanban trực quan, dễ sử dụng nhưng thiếu công cụ web hiện đại

- **Hạn chế của các giải pháp hiện tại**
  - Thiếu tính năng cộng tác real-time
  - Chưa tích hợp AI để hỗ trợ người dùng
  - Giao diện chưa thân thiện, chưa responsive tốt
  - Phân quyền và bảo mật chưa đầy đủ

### Bài toán đặt ra

**Xây dựng hệ thống quản lý công việc web-based với:**
- ✅ Quản lý boards, columns và cards theo mô hình Kanban
- ✅ Real-time collaboration cho nhiều người dùng
- ✅ Tích hợp AI gợi ý nhiệm vụ thông minh
- ✅ Calendar quản lý sự kiện và deadlines
- ✅ Phân quyền Owner/Member rõ ràng
- ✅ Bảo mật và hiệu năng cao

---

## SLIDE 3: MỤC ĐÍCH CỦA ĐỒ ÁN

### Mục đích chính

1. **Xây dựng hệ thống quản lý công việc hoàn chỉnh**
   - Giao diện trực quan theo mô hình Kanban
   - Trải nghiệm người dùng tốt, responsive trên mọi thiết bị

2. **Triển khai real-time collaboration**
   - Nhiều người dùng làm việc cùng lúc trên cùng một board
   - Cập nhật đồng bộ tự động qua Socket.IO
   - Hiển thị thành viên đang online

3. **Tích hợp AI hỗ trợ người dùng**
   - Gợi ý nhiệm vụ thông minh dựa trên context
   - Xem xét WIP limits và cấu trúc board hiện tại

4. **Đảm bảo bảo mật và hiệu năng**
   - JWT authentication với refresh token
   - Tối ưu database queries với aggregation pipelines
   - Bảo vệ dữ liệu người dùng

---

## SLIDE 4: PHẠM VI CỦA ĐỒ ÁN

### Phạm vi nghiên cứu

**Ứng dụng web:**
- Chạy trên trình duyệt web (Chrome, Firefox, Safari, Edge)
- Responsive design: Mobile, Tablet, Desktop
- Hỗ trợ Dark mode

**Quản lý công việc:**
- Quản lý công việc cá nhân và nhóm
- Phân quyền Owner và Member
- Real-time updates qua Socket.IO

**Tính năng chính:**
- ✅ Authentication & Authorization
- ✅ Quản lý Board, Column, Card
- ✅ Calendar & Events
- ✅ AI Suggestions
- ✅ Real-time Collaboration
- ✅ WIP Limits
- ✅ Search & Filter

### Giới hạn

- Chưa có mobile app (chỉ web)
- Chưa tích hợp với các công cụ bên thứ ba (Slack, GitHub)
- Chưa có tính năng quên mật khẩu
- Chưa hỗ trợ file attachments

---

## SLIDE 5: MÔ TẢ GIẢI PHÁP - KIẾN TRÚC HỆ THỐNG

### Kiến trúc tổng thể

```
┌─────────────────────────────────────────┐
│         CLIENT LAYER (Frontend)         │
│  React 19 + Redux + Socket.IO Client    │
└─────────────────────────────────────────┘
                  ↕ HTTP/REST + WebSocket
┌─────────────────────────────────────────┐
│         SERVER LAYER (Backend)          │
│  Express.js + Socket.IO Server          │
│  Controllers → Services → Models        │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│       DATABASE LAYER                    │
│         MongoDB Atlas                    │
└─────────────────────────────────────────┘
```

### Kiến trúc phân lớp

1. **Presentation Layer (Frontend)**
   - React Components & Pages
   - Redux Store (State Management)
   - React Router (Client-side Routing)

2. **Business Logic Layer (Backend)**
   - Controllers (Request Handlers)
   - Services (Business Logic)
   - Validations (Joi Schemas)

3. **Data Access Layer**
   - Models (Database Operations)
   - MongoDB Collections

---

## SLIDE 6: MÔ TẢ GIẢI PHÁP - CÔNG NGHỆ SỬ DỤNG

### Frontend Stack

- **React 19** - UI Framework
- **Vite** - Build tool & Dev server
- **Redux Toolkit** - State management
- **Tailwind CSS v4** - Styling
- **Socket.IO Client** - Real-time communication
- **@dnd-kit** - Drag & Drop functionality
- **React Router v7** - Routing

### Backend Stack

- **Node.js + Express.js** - Server framework
- **MongoDB Atlas** - NoSQL Database
- **Socket.IO Server** - Real-time collaboration
- **JWT** - Authentication (Access + Refresh tokens)
- **Bcryptjs** - Password hashing
- **Joi** - Data validation

### External Services

- **Cloudinary** - Image storage & processing
- **Brevo** - Email service (verification)
- **Groq AI** - AI suggestions

---

## SLIDE 7: MÔ TẢ GIẢI PHÁP - CÁC TÍNH NĂNG CHÍNH (1/2)

### 1. Hệ thống xác thực và phân quyền

- **Đăng ký/Đăng nhập** với email và password
- **Xác thực email** qua Brevo
- **JWT Authentication** với tự động refresh token
- **Phân quyền Owner/Member:**
  - Owner: Tạo/sửa/xóa board, column; Mời thành viên; Cấu hình WIP
  - Member: Xem board; Tạo/sửa/xóa cards; Di chuyển cards

### 2. Quản lý Board

- Tạo, sửa, xóa boards (chỉ Owner)
- Đánh dấu yêu thích boards (per-user)
- Tìm kiếm và lọc boards
- Quản lý thành viên, mời người dùng vào board
- Cấu hình WIP (Work In Progress) limits
- Hiển thị thành viên online real-time

### 3. Quản lý Column và Card

- **Drag & Drop** để sắp xếp columns và di chuyển cards
- Tạo, sửa, xóa cards với **Markdown editor**
- Upload **cover images** cho cards
- Quản lý thành viên card
- Comments trong cards
- Lưu trữ và khôi phục cards

---

## SLIDE 8: MÔ TẢ GIẢI PHÁP - CÁC TÍNH NĂNG CHÍNH (2/2)

### 4. Calendar và Events

- Hiển thị lịch tháng
- Tạo, sửa, xóa events (chỉ Owner)
- Liên kết events với boards
- Tùy chỉnh màu sắc events
- Member có thể xem events

### 5. Real-time Collaboration

- **Cập nhật real-time** khi có thay đổi
- Hiển thị thành viên đang online
- Notifications real-time
- Synchronization tự động giữa các clients
- Room-based architecture: `board:{boardId}`

### 6. AI Suggestions

- Tích hợp **Groq AI**
- Gợi ý nhiệm vụ thông minh dựa trên context
- Xem xét WIP limits và cấu trúc board hiện tại
- Hỗ trợ người dùng tạo nhiệm vụ hiệu quả hơn

---

## SLIDE 9: TRIỂN KHAI - KIẾN TRÚC CODE

### Cấu trúc Frontend

```
todolist-web/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── redux/         # Redux store & slices
│   ├── hooks/         # Custom React hooks
│   ├── apis/          # API service layer
│   ├── routes/        # Route configurations
│   └── utils/         # Utility functions
```

### Cấu trúc Backend

```
todolist-api/
├── src/
│   ├── controllers/   # Request handlers
│   ├── services/      # Business logic
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middlewares/   # Express middlewares
│   ├── validations/   # Joi schemas
│   ├── providers/     # Third-party services
│   └── sockets/       # Socket.IO handlers
```

### Database Schema

- **Users** - Thông tin người dùng
- **Boards** - Bảng dự án
- **Columns** - Cột công việc
- **Cards** - Thẻ công việc
- **Events** - Sự kiện lịch
- **Invitations** - Lời mời tham gia board

---

## SLIDE 10: TRIỂN KHAI - CÁC MODULE CHÍNH

### Module Authentication

- Đăng ký tài khoản với validation
- Đăng nhập với JWT tokens
- Xác thực email qua Brevo
- Auto refresh token khi hết hạn
- Middleware xác thực cho protected routes

### Module Real-time Communication

- Socket.IO với room-based architecture
- Events: `BE_CARD_CREATED`, `BE_CARD_UPDATED`, `BE_COLUMN_CREATED`, ...
- Frontend hooks: `useRealtimeCardMove`, `useBoardOnlineUsers`
- Tự động đồng bộ state giữa các clients

### Module AI Suggestions

- Kết nối Groq AI Service
- Xử lý context của board (columns, cards, WIP limits)
- Tạo gợi ý nhiệm vụ thông minh
- Hiển thị và cho phép người dùng chọn gợi ý

---

## SLIDE 11: KIỂM THỬ - CHIẾN LƯỢC KIỂM THỬ

### Kiểm thử chức năng

✅ **Authentication & Authorization**
- Đăng ký, đăng nhập thành công
- Xác thực email hoạt động
- Phân quyền Owner/Member đúng

✅ **CRUD Operations**
- Tạo/sửa/xóa Board, Column, Card
- Validation dữ liệu đầu vào
- Xử lý lỗi đúng cách

✅ **Real-time Features**
- Cập nhật real-time giữa nhiều clients
- Hiển thị users online
- Synchronization tự động

✅ **Drag & Drop**
- Di chuyển cards giữa columns
- Sắp xếp lại columns
- Cập nhật state đúng

---

## SLIDE 12: KIỂM THỬ - KẾT QUẢ ĐẠT ĐƯỢC

### Về chức năng

- ✅ **Mức độ hoàn thành: 90-95%** yêu cầu chức năng
- ✅ Tất cả các tính năng chính hoạt động ổn định
- ✅ Real-time collaboration hoạt động tốt
- ✅ AI suggestions tích hợp thành công

### Về kỹ thuật

- ✅ Kiến trúc rõ ràng, code dễ bảo trì
- ✅ Bảo mật tốt với JWT, bcrypt, httpOnly cookies
- ✅ Hiệu năng được tối ưu với aggregation pipelines
- ✅ Error handling đầy đủ

### Về giao diện

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark mode hoạt động tốt
- ✅ UI/UX hiện đại với animations
- ✅ Drag & drop mượt mà

---

## SLIDE 13: KIỂM THỬ - HẠN CHẾ VÀ HƯỚNG PHÁT TRIỂN

### Hạn chế hiện tại

- ⚠️ Chưa có automated testing suite
- ⚠️ Chưa có tính năng quên mật khẩu
- ⚠️ Chưa hỗ trợ file attachments
- ⚠️ Chưa có monitoring và logging system

### Hướng phát triển trong tương lai

🚀 **Mở rộng tính năng AI**
- Task automation
- Smart scheduling
- Predictive analytics

🚀 **Tích hợp với công cụ bên thứ ba**
- Slack, GitHub, Jira
- Google Calendar
- Microsoft Teams

🚀 **Mobile Applications**
- React Native app
- iOS và Android support

🚀 **Advanced Features**
- Analytics và reporting
- Multi-language support
- Template system cho boards
- Time tracking

---

## SLIDE 14: KẾT LUẬN

### Những gì đã đạt được

✅ **Hệ thống quản lý công việc hoàn chỉnh**
- Quản lý công việc trực quan theo mô hình Kanban
- Giao diện thân thiện, responsive trên mọi thiết bị

✅ **Real-time Collaboration**
- Nhiều người dùng làm việc cùng lúc
- Cập nhật đồng bộ tự động
- Hiển thị thành viên online

✅ **Tích hợp AI**
- Gợi ý nhiệm vụ thông minh
- Hỗ trợ người dùng hiệu quả hơn

✅ **Bảo mật và hiệu năng**
- JWT authentication
- Tối ưu database queries
- Bảo vệ dữ liệu người dùng

---

## SLIDE 15: KẾT LUẬN - ĐÓNG GÓP CỦA ĐỒ ÁN

### Đóng góp chính

1. **Ứng dụng thành công mô hình Kanban**
   - Giao diện trực quan, dễ sử dụng
   - Quy trình quản lý công việc hiệu quả

2. **Kiến trúc real-time collaboration**
   - Room-based Socket.IO architecture
   - Synchronization tự động giữa clients
   - Hiển thị users online

3. **Tích hợp AI vào quản lý công việc**
   - Context-aware suggestions
   - Hỗ trợ người dùng tạo nhiệm vụ

4. **Áp dụng best practices**
   - Layered architecture
   - RESTful API design
   - Modern web technologies
   - Security best practices

### Kết luận

Hệ thống đáp ứng các yêu cầu đã đề ra và có thể mở rộng trong tương lai.  
Đề tài góp phần vào việc phát triển công cụ quản lý công việc hiện đại, hiệu quả.

---

## SLIDE 16: CẢM ƠN

# CẢM ƠN THẦY CÔ VÀ CÁC BẠN ĐÃ LẮNG NGHE!

**Sẵn sàng trả lời câu hỏi**

---

## GHI CHÚ CHO NGƯỜI THUYẾT TRÌNH

### Thời gian trình bày: 10-15 phút

### Cấu trúc thời gian đề xuất:

1. **Mở đầu/Phát biểu bài toán** (2 phút)
   - Giới thiệu vấn đề
   - Bài toán đặt ra

2. **Mục đích/Phạm vi** (1 phút)
   - Mục tiêu chính
   - Phạm vi nghiên cứu

3. **Mô tả giải pháp** (5-6 phút) ⭐ **Phần quan trọng nhất**
   - Kiến trúc hệ thống
   - Công nghệ sử dụng
   - Các tính năng chính (demo nếu có thể)

4. **Triển khai/Kiểm thử** (3-4 phút)
   - Cấu trúc code
   - Các module chính
   - Kết quả kiểm thử

5. **Kết luận** (1 phút)
   - Những gì đã đạt được
   - Đóng góp của đồ án

### Lưu ý khi trình bày:

- ✅ Chuẩn bị demo live hoặc video demo các tính năng chính
- ✅ Chuẩn bị screenshots của ứng dụng
- ✅ Nhấn mạnh các điểm nổi bật: real-time collaboration, AI integration
- ✅ Sẵn sàng trả lời câu hỏi về kiến trúc, công nghệ, và các quyết định thiết kế
- ✅ Giải thích rõ ràng về phân quyền Owner/Member
- ✅ Demo tính năng real-time nếu có thể

---

## PHỤ LỤC: CÁC SLIDE BỔ SUNG (TÙY CHỌN)

### SLIDE BỔ SUNG 1: DEMO SCREENSHOTS

**Giao diện chính:**
- Trang đăng nhập/đăng ký
- Trang quản lý boards
- Trang chi tiết board (Kanban view)
- Trang Calendar
- Trang Settings

### SLIDE BỔ SUNG 2: SƠ ĐỒ KIẾN TRÚC CHI TIẾT

- System Architecture Diagram
- Layered Architecture Diagram
- Data Flow Diagram
- Authentication Flow Diagram

### SLIDE BỔ SUNG 3: DATABASE SCHEMA

- ER Diagram
- Database Schema Diagram
- Mối quan hệ giữa các collections

### SLIDE BỔ SUNG 4: API ENDPOINTS

- RESTful API endpoints chính
- Request/Response examples
- Error handling

---

**Kết thúc slide thuyết trình**

