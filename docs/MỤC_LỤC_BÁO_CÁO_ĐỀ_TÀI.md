# MỤC LỤC BÁO CÁO ĐỀ TÀI
## XÂY DỰNG ỨNG DỤNG WEB QUẢN LÝ CÔNG VIỆC THEO MÔ HÌNH KANBAN

---

## PHẦN MỞ ĐẦU
1. **Lý do chọn đề tài**
2. **Mục tiêu và phạm vi nghiên cứu**
3. **Đối tượng nghiên cứu**
4. **Phương pháp nghiên cứu**
5. **Cấu trúc báo cáo**

---

## CHƯƠNG 1: TỔNG QUAN VỀ ĐỀ TÀI
1.1. **Giới thiệu về hệ thống quản lý công việc**
   - Khái niệm và vai trò của hệ thống quản lý công việc
   - Các phương pháp quản lý công việc phổ biến (Kanban, Scrum, Todo List)
   - Xu hướng ứng dụng công nghệ thông tin trong quản lý dự án

1.2. **Bài toán đặt ra**
   - Nhu cầu quản lý công việc cá nhân và nhóm
   - Yêu cầu về tính năng và hiệu năng
   - Vấn đề hiện tại trong các ứng dụng quản lý công việc

1.3. **Mục tiêu và yêu cầu của hệ thống**
   - Mục tiêu chính
   - Yêu cầu chức năng
   - Yêu cầu phi chức năng

1.4. **Phạm vi nghiên cứu và giới hạn**
   - Phạm vi thực hiện
   - Giới hạn của đề tài

---

## CHƯƠNG 2: CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ
2.1. **Cơ sở lý thuyết**
   - Phương pháp quản lý dự án Kanban
     - Sơ đồ mô tả phương pháp Kanban
     - Quy trình làm việc với Kanban board
   - Quy trình quản lý công việc (Workflow Management)
   - Hệ thống quản lý người dùng và phân quyền

2.2. **Công nghệ Frontend**
   - **React Framework**
     - React Hooks (useState, useEffect, useCallback, useMemo)
     - React Router v7 (Client-side routing)
     - React Context API
   - **State Management**
     - Redux Toolkit
     - Redux Persist (Local Storage)
   - **UI/UX Technologies**
     - Tailwind CSS v4 (Utility-first CSS)
     - Lucide React (Icon library)
     - React Hook Form (Form management)
     - React Day Picker v9 (Date picker component)
   - **Libraries & Tools**
     - @dnd-kit (Drag & Drop functionality)
     - Socket.IO Client (Real-time communication)
     - Axios (HTTP client)
     - React Toastify (Notifications)
     - @uiw/react-md-editor (Markdown editor)
     - Moment.js (Date manipulation)
     - GSAP (Animations)
   - **Build Tools**
     - Vite (Build tool and dev server)
     - ESLint (Code linting)

2.3. **Công nghệ Backend**
   - **Node.js Runtime**
     - Express.js Framework
     - Async-exit-hook (Cleanup handlers)
   - **Database**
     - MongoDB (NoSQL database)
     - MongoDB Native Driver
   - **Authentication & Security**
     - JWT (JSON Web Tokens)
     - Bcryptjs (Password hashing)
     - Cookie Parser
   - **Real-time Communication**
     - Socket.IO (WebSocket communication)
   - **Third-party Services**
     - Cloudinary (Image/file upload & storage)
     - Brevo (Email service)
     - Groq SDK (AI/ML service)
   - **Validation & Error Handling**
     - Joi (Schema validation)
     - HTTP Status Codes
     - Custom Error Middleware
   - **File Upload**
     - Multer (Multipart form data)
     - Streamifier
   - **Build & Development**
     - Babel (JavaScript compiler)
     - Nodemon (Development server)
     - Cross-env (Environment variables)

2.4. **Kiến trúc hệ thống**
   - Mô hình Client-Server
   - RESTful API Architecture
   - Real-time Communication Architecture
   - Database Schema Design
   - Sơ đồ tổng quan kiến trúc hệ thống

---

## CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
3.1. **Phân tích yêu cầu**
   - **Use Case Diagram**
     - Biểu đồ Use Case tổng quan
     - Các actor chính (User, Admin)
     - Các use case chính của hệ thống
   - **Mô tả Use Case chi tiết**
     - Use Case: Đăng ký/Đăng nhập
     - Use Case: Quản lý Board
     - Use Case: Quản lý Card
     - Use Case: Quản lý Calendar
     - Use Case: Real-time Collaboration
   - Yêu cầu chức năng
     - Quản lý người dùng (Đăng ký, đăng nhập, xác thực tài khoản)
     - Quản lý bảng dự án (Board)
       - Tạo, sửa, xóa board (chỉ Owner)
       - Đánh dấu yêu thích board (per-user)
       - Rời khỏi board (Member)
     - Quản lý cột công việc (Column)
       - Tạo, sửa, xóa column (chỉ Owner)
       - Di chuyển card trong/between columns (Owner và Member)
     - Quản lý thẻ công việc (Card/Task)
     - Quản lý lịch sự kiện (Calendar/Events)
     - Quản lý thành viên và phân quyền
       - Phân quyền Owner và Member
       - Mời thành viên (chỉ Owner)
       - Hiển thị thành viên online real-time
     - Gợi ý nhiệm vụ bằng AI
     - Tìm kiếm và lọc dữ liệu
     - Lưu trữ và khôi phục công việc
   - Yêu cầu phi chức năng
     - Hiệu năng và tốc độ phản hồi
     - Bảo mật thông tin
     - Giao diện thân thiện, responsive
     - Khả năng mở rộng

3.2. **Thiết kế hệ thống**
   - **Kiến trúc tổng thể**
     - Sơ đồ kiến trúc hệ thống (System Architecture Diagram)
     - Mô hình phân lớp (Layered Architecture Diagram)
       - Presentation Layer
       - Business Logic Layer
       - Data Access Layer
     - Sơ đồ luồng dữ liệu (Data Flow Diagram)
   
   - **Thiết kế Database**
     - ER Diagram (Entity Relationship Diagram)
     - Database Schema Diagram
     - Mối quan hệ giữa các collection
     - Các model chính:
       - User Model
       - Board Model
       - Column Model
       - Card Model
       - Event Model
       - Invitation Model
   
   - **Thiết kế API**
     - RESTful API endpoints
     - API Flow Diagram
     - Request/Response format
     - Error handling structure
     - Authentication flow diagram

3.3. **Thiết kế giao diện người dùng**
   - **Wireframes và Mockups**
     - Trang đăng nhập/đăng ký
     - Trang quản lý boards
     - Trang chi tiết board (Kanban view)
     - Trang lịch (Calendar view)
     - Trang cài đặt
   
   - **UI/UX Design Principles**
     - Responsive design (Mobile, Tablet, Desktop)
     - Dark mode support
     - Accessibility considerations
     - User experience flow

3.4. **Thiết kế các module chính**
   - **Module Authentication**
     - Activity Diagram: Quy trình đăng ký/đăng nhập
     - Sequence Diagram: Authentication flow
     - Đăng ký tài khoản
     - Đăng nhập
     - Xác thực email
     - Quên mật khẩu
     - Đăng xuất
   
   - **Module Quản lý Board**
     - Activity Diagram: Quy trình quản lý board
     - Sequence Diagram: Tạo/Cập nhật/Xóa board
     - Tạo/xóa/sửa board (chỉ Owner)
     - Tìm kiếm và lọc board
     - Đánh dấu yêu thích (per-user, lưu trong User model)
     - Quản lý thành viên (mời user - chỉ Owner)
     - Rời khỏi board (Member)
     - Cài đặt WIP (Work In Progress - chỉ Owner)
     - Hiển thị thành viên online real-time
   
   - **Module Quản lý Column**
     - Activity Diagram: Quy trình quản lý column
     - Flowchart: Drag & Drop column
     - Tạo/xóa/sửa column (chỉ Owner)
     - Sắp xếp lại thứ tự column (Drag & Drop - chỉ Owner)
     - Tùy chỉnh màu sắc (chỉ Owner)
     - Di chuyển card trong/between columns (Owner và Member)
   
   - **Module Quản lý Card**
     - Activity Diagram: Quy trình quản lý card
     - Sequence Diagram: Di chuyển card giữa các column
     - Flowchart: Quy trình tạo/cập nhật card
     - Tạo/xóa/sửa/xóa card
     - Di chuyển card giữa các column
     - Quản lý thành viên card
     - Mô tả card (Markdown editor)
     - Lưu trữ và khôi phục card
     - Tìm kiếm card
   
   - **Module Calendar**
     - Activity Diagram: Quy trình quản lý sự kiện
     - Sequence Diagram: Tạo/Cập nhật/Xóa event
     - Hiển thị lịch tháng
     - Tạo/sửa/xóa sự kiện
     - Tùy chỉnh màu sắc sự kiện
     - Liên kết sự kiện với board
   
   - **Module AI Suggestions**
     - Sequence Diagram: AI suggestion flow
     - Flowchart: Quy trình tạo gợi ý
     - Tích hợp Groq AI
     - Gợi ý tạo nhiệm vụ thông minh
     - Context-aware suggestions
   
   - **Module Real-time Updates**
     - Sequence Diagram: Real-time communication flow
     - Activity Diagram: Socket.IO event handling
     - Socket.IO integration
     - Real-time notifications
     - Collaborative editing

---

## CHƯƠNG 4: CÀI ĐẶT VÀ TRIỂN KHAI
4.1. **Môi trường phát triển**
   - Yêu cầu hệ thống
   - Cài đặt công cụ phát triển
   - Cấu hình môi trường (Development, Production)

4.2. **Cài đặt Frontend**
   - Khởi tạo dự án với Vite
   - Cài đặt các dependencies
   - Cấu hình Tailwind CSS
   - Cấu hình Redux Store
   - Cấu hình React Router
   - Cấu hình Socket.IO Client
   - Cấu hình Axios và authorization
   - Cấu hình environment variables

4.3. **Cài đặt Backend**
   - Khởi tạo dự án Node.js
   - Cài đặt Express.js
   - Cấu hình MongoDB connection
   - Thiết lập các routes và middleware
   - Cấu hình Socket.IO Server
   - Tích hợp Cloudinary
   - Tích hợp Brevo Email Service
   - Tích hợp Groq AI Service
   - Cấu hình JWT authentication
   - Cấu hình CORS và security

4.4. **Cấu trúc thư mục dự án**
   - **Frontend Structure**
     - `/src/components/` - React components
     - `/src/pages/` - Page components
     - `/src/redux/` - Redux store và slices
     - `/src/hooks/` - Custom React hooks
     - `/src/apis/` - API service layer
     - `/src/utils/` - Utility functions
     - `/src/routes/` - Route configurations
     - `/src/Context/` - React Context providers
   
   - **Backend Structure**
     - `/src/controllers/` - Request handlers
     - `/src/services/` - Business logic
     - `/src/models/` - Database models
     - `/src/routes/` - API routes
     - `/src/middlewares/` - Express middlewares
     - `/src/validations/` - Data validation schemas
     - `/src/providers/` - Third-party service providers
     - `/src/utils/` - Utility functions
     - `/src/config/` - Configuration files
     - `/src/sockets/` - Socket.IO handlers

4.5. **Cấu hình Database**
   - Thiết lập MongoDB Atlas
   - Tạo collections
   - Định nghĩa indexes
   - Thiết lập relationships

---

## CHƯƠNG 5: TRIỂN KHAI CÁC CHỨC NĂNG
5.1. **Hệ thống xác thực và phân quyền**
   - Đăng ký tài khoản
   - Đăng nhập/JWT authentication
   - Xác thực email
   - Quản lý session và token refresh
   - Middleware xác thực
   - Phân quyền người dùng (Owner, Member)
     - **Owner permissions:**
       - Tạo, sửa, xóa board
       - Tạo, sửa, xóa column
       - Mời thành viên vào board
       - Cấu hình WIP settings
       - Tất cả quyền của Member
     - **Member permissions:**
       - Xem board và cards
       - Tạo, sửa, xóa cards
       - Di chuyển cards (trong/between columns)
       - Đánh dấu yêu thích board
       - Rời khỏi board
       - Không thể: sửa/xóa board, sửa/xóa column, mời thành viên

5.2. **Quản lý Board**
   - Tạo board mới (chỉ Owner)
   - Hiển thị danh sách boards
   - Tìm kiếm và lọc boards
   - Cập nhật thông tin board (chỉ Owner)
   - Xóa board (chỉ Owner)
   - Đánh dấu yêu thích (per-user, lưu trong User.favoriteBoardIds)
   - Quản lý thành viên board
     - Mời thành viên (chỉ Owner)
     - Hiển thị thành viên online real-time
     - Rời khỏi board (Member)
   - Cài đặt WIP (Work In Progress - chỉ Owner)
   - Pagination

5.3. **Quản lý Column**
   - Tạo column mới (chỉ Owner)
   - Sắp xếp lại columns (Drag & Drop - chỉ Owner)
   - Cập nhật thông tin column (chỉ Owner)
   - Xóa column (chỉ Owner)
   - Tùy chỉnh màu sắc column (chỉ Owner)
   - Quản lý cards trong column
   - Di chuyển cards (trong/between columns - Owner và Member)
     - Member có thể cập nhật cardOrderIds khi di chuyển card
     - Member không thể sửa/xóa column nhưng có thể di chuyển card

5.4. **Quản lý Card**
   - Tạo card mới
   - Hiển thị chi tiết card
   - Cập nhật thông tin card
   - Xóa card
   - Di chuyển card (Drag & Drop)
   - Quản lý thành viên card
   - Mô tả card với Markdown
   - Quản lý ngày tháng (ngày bắt đầu, hạn hoàn thành với thời gian)
   - Hiển thị badge hạn công việc (start → due) trên card
   - Lưu trữ và khôi phục card
   - Tìm kiếm card trong board
   - Hoạt động (Activity log)

5.5. **Calendar và Events**
   - Hiển thị lịch tháng
   - Chỉ Owner được tạo/sửa/xóa sự kiện; Member xem sự kiện
   - Dropdown lựa chọn board chỉ hiển thị boards do Owner quản lý
   - Liên kết sự kiện với board
   - Lọc và tìm kiếm sự kiện

5.6. **Tích hợp AI - Gợi ý nhiệm vụ**
   - Kết nối Groq AI Service
   - Xử lý context của board
   - Tạo gợi ý nhiệm vụ thông minh
   - Hiển thị và chọn gợi ý
   - Xử lý lỗi và fallback

5.7. **Real-time Communication**
   - Cấu hình Socket.IO
   - Real-time notifications
   - Collaborative updates
   - Invitation handling
   - Connection management
   - **Sơ đồ Real-time Communication Architecture**
   - **Sequence Diagram: Real-time update flow**
   - Real-time đã triển khai
     - Kiến trúc room: `board:{boardId}` (client join/leave theo board)
     - **Users Online Tracking:**
       - `FE_JOIN_BOARD`: client join board room với thông tin user
       - `FE_LEAVE_BOARD`: client leave board room
       - `BE_BOARD_USERS_ONLINE`: emit danh sách users đang online trong board
       - Hook `useBoardOnlineUsers` để quản lý danh sách users online
       - Hiển thị chỉ users đang online trong BoardActions
     - Sự kiện Board/Column
       - `BE_COLUMNS_REORDERED`: cập nhật thứ tự columns (columnOrderIds)
       - `BE_COLUMN_CREATED`: thêm column mới (kèm placeholder card)
       - `BE_COLUMN_UPDATED`: cập nhật thuộc tính column (tiêu đề, màu sắc,...)
       - `BE_COLUMN_DELETED`: xóa column và đồng bộ columnOrderIds
       - `BE_CARD_MOVED_IN_COLUMN`: sắp xếp thẻ trong cùng column (cardOrderIds)
       - `BE_CARD_MOVED_BETWEEN_COLUMNS`: di chuyển thẻ giữa các column (refetch board)
       - `BE_MEMBER_LEFT_BOARD`: thông báo khi member rời khỏi board (chỉ Owner nhận)
     - Sự kiện Card
       - `BE_CARD_CREATED`: thêm thẻ mới (xóa placeholder nếu có)
       - `BE_CARD_UPDATED`: sửa thẻ (tiêu đề, mô tả, cover, thành viên, bình luận,...)
       - `BE_CARD_DELETED`: xóa thẻ (thêm placeholder nếu column rỗng)
     - Frontend handler (Redux + hooks)
       - Hook `useRealtimeCardMove` lắng nghe events, cập nhật `activeBoard`
       - Tránh trùng lặp (kiểm tra tồn tại), giữ nguyên `cards/cardOrderIds` khi chỉ sửa thuộc tính column
       - Tự động đóng ActiveCard modal nếu thẻ/column đang mở bị xóa
       - Hook `useBoardOnlineUsers` để track và hiển thị users online

5.8. **UI/UX Features**
   - Dark mode/Light mode
   - Responsive design
   - Drag & Drop animations
   - Loading states
   - Error handling UI
   - Toast notifications
   - Modal dialogs
   - Tooltips và hints

---

## CHƯƠNG 6: KIỂM THỬ VÀ ĐÁNH GIÁ
6.1. **Chiến lược kiểm thử**
   - Unit Testing
   - Integration Testing
   - End-to-end Testing
   - User Acceptance Testing

6.2. **Kiểm thử chức năng**
   - Kiểm thử Authentication
   - Kiểm thử CRUD operations
   - Kiểm thử Drag & Drop
   - Kiểm thử Calendar
   - Kiểm thử AI Suggestions
   - Kiểm thử Real-time features

6.3. **Kiểm thử hiệu năng**
   - Đo lường thời gian phản hồi
   - Tối ưu hóa database queries
   - Code splitting và lazy loading
   - Image optimization
   - Caching strategies

6.4. **Kiểm thử bảo mật**
   - Xác thực và authorization
   - SQL/NoSQL Injection prevention
   - XSS (Cross-Site Scripting) protection
   - CSRF protection
   - Secure password handling
   - JWT token security

6.5. **Kiểm thử giao diện**
   - Responsive design testing
   - Cross-browser compatibility
   - Accessibility testing
   - User experience evaluation

6.6. **Kết quả kiểm thử và đánh giá**
   - Kết quả các bài kiểm thử
   - Đánh giá tổng quan
   - Những điểm mạnh
   - Những điểm cần cải thiện

---

## CHƯƠNG 7: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
7.1. **Tổng kết**
   - Những gì đã đạt được
   - Mức độ hoàn thành các yêu cầu
   - Đóng góp của đề tài

7.2. **Những hạn chế**
   - Hạn chế về chức năng
   - Hạn chế về kỹ thuật
   - Hạn chế về tài nguyên

7.3. **Hướng phát triển trong tương lai**
   - Mở rộng tính năng AI (Task automation, Smart scheduling)
   - Tích hợp với các công cụ bên thứ ba (Slack, GitHub, Jira)
   - Mobile applications (React Native)
   - Advanced analytics và reporting
   - Multi-language support
   - Advanced permission system
   - Template system cho boards
   - Time tracking
   - File attachments
   - Comments và mentions
   - Webhooks và API integrations

7.4. **Kinh nghiệm và bài học rút ra**
   - Kinh nghiệm phát triển
   - Những thách thức gặp phải
   - Bài học về công nghệ
   - Bài học về quản lý dự án

---

## PHỤ LỤC
**Phụ lục A:** Các bảng trong database
   - ER Diagram chi tiết
   - Database Schema Diagram
   - Mô tả các collection và fields

**Phụ lục B:** API Documentation
   - Danh sách đầy đủ các API endpoints
   - Request/Response examples
   - Error codes và messages

**Phụ lục C:** Source code và screenshots
   - Screenshots giao diện ứng dụng
   - Code snippets quan trọng
   - Cấu trúc thư mục dự án

**Phụ lục D:** Hướng dẫn cài đặt và sử dụng
   - Hướng dẫn cài đặt môi trường
   - Hướng dẫn chạy ứng dụng
   - Hướng dẫn sử dụng các tính năng chính

**Phụ lục E:** Các diagram và sơ đồ
   - Use Case Diagram
   - Activity Diagrams
   - Sequence Diagrams
   - Flowcharts
   - Architecture Diagrams

**Phụ lục F:** Tài liệu tham khảo

---

## TÀI LIỆU THAM KHẢO
1. Tài liệu chính thức của React
2. Tài liệu chính thức của Node.js và Express
3. Tài liệu MongoDB
4. Tài liệu các thư viện và framework sử dụng
5. Các nghiên cứu và bài báo liên quan

---

**Ghi chú:** Mục lục này có thể được điều chỉnh tùy theo yêu cầu cụ thể của cơ sở đào tạo và định dạng báo cáo.

