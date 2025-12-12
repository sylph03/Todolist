## Thiết kế Các Module Chính

Tài liệu này tập hợp các Activity Diagram và Sequence Diagram cho các module quan trọng của hệ thống.

---

### 1. Module Authentication

**Activity Diagram – Quy trình đăng ký/đăng nhập**

```mermaid
flowchart TB
    A([Bắt đầu]) --> B[Nhập email, mật khẩu]
    B --> C{Chọn hành động?}
    C -->|Đăng ký| D[Kiểm tra email trùng]
    D -->|Trùng| E[Thông báo lỗi]
    D -->|Không trùng| F[Mã hóa mật khẩu, tạo user]
    F --> G[Gửi email xác thực]
    G --> H[Chờ người dùng xác thực]
    C -->|Đăng nhập| I[Kiểm tra user tồn tại]
    I -->|Không tồn tại| E
    I -->|Tồn tại| J[So sánh mật khẩu bcrypt]
    J -->|Sai| E
    J -->|Đúng| K[Tạo access & refresh token]
    H --> L[Hoàn tất kích hoạt]
    K --> M[Cập nhật log đăng nhập]
    L --> N((Kết thúc))
    M --> N
    E --> N
```

**Sequence Diagram – Authentication Flow**

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant API as Auth API
    participant Service as Auth Service
    participant DB

    User->>FE: Submit email/password
    FE->>API: POST /auth/login
    API->>Service: validatePayload()
    Service->>DB: findUserByEmail()
    DB-->>Service: userDoc
    Service->>Service: comparePassword()
    Service-->>API: tokens + profile
    API-->>FE: 200 OK (access + refresh token)
    FE-->>User: Lưu token, chuyển dashboard
```

---

### 2. Module Quản lý Board

**Activity Diagram – Quy trình quản lý board**

```mermaid
flowchart TB
    A([Bắt đầu]) --> B[Owner mở trang Boards]
    B --> C[Chọn hành động]
    C -->|Tạo board| D[Nhập thông tin + màu nền]
    D --> E[Validate title/slug]
    E -->|Hợp lệ| F[Tạo board, set ownerIds]
    E -->|Không hợp lệ| G[Hiển thị lỗi]
    C -->|Chỉnh sửa| H[Kiểm tra quyền Owner]
    H -->|Đúng| I[Cập nhật metadata, WIP, colors]
    H -->|Sai| G
    C -->|Xóa| J[Xác nhận + kiểm tra quyền]
    J -->|Đúng| K[Xóa mềm board, cascade column/card]
    C -->|Mời thành viên| L[Nhập email invitee]
    L --> M[Tạo invitation + gửi email]
    C -->|Đánh dấu yêu thích| N[Toggle favoriteBoardIds]
    {F,I,K,M,N} --> O[Cập nhật realtime + log]
    {G,O} --> P((Kết thúc))
```

**Sequence Diagram – Tạo board**

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant API as Board API
    participant Service as Board Service
    participant DB

    User->>FE: Nhập title, description
    FE->>API: POST /boards (JWT)
    API->>Service: createBoard(payload, userId)
    Service->>Service: validateSchema()
    Service->>DB: insertOne(board)
    DB-->>Service: boardCreated
    Service-->>API: board detail
    API-->>FE: 201 Created
    FE-->>User: Render board mới
    Service-->>Socket: emit boardCreated event
```

---

### 3. Module Quản lý Column

**Activity Diagram – CRUD Column & Drag/Drop**

```mermaid
flowchart TB
    A([Bắt đầu]) --> B[Owner mở board]
    B --> C{Hành động?}
    C -->|Tạo column| D[Nhập title, màu]
    D --> E[Validate + convert ObjectId]
    E --> F[Insert column]
    F --> G[Push columnId vào columnOrderIds]
    C -->|Sửa column| H[Kiểm tra quyền Owner]
    H -->|OK| I[Cập nhật title/màu]
    C -->|Xóa column| J[Xác nhận]
    J --> K[Xóa column + cards thuộc column]
    C -->|Sắp xếp| L[Drag & Drop column]
    L --> M[Gửi mảng columnOrderIds mới]
    M --> N[Cập nhật board.columnOrderIds]
    {G,I,K,N} --> O[Emit realtime update]
    O --> P((Kết thúc))
```

**Sequence Diagram – Drag & Drop Column**

```mermaid
sequenceDiagram
    participant User
    participant FE as Board UI
    participant API as Board API
    participant Service as Board Service
    participant DB

    User->>FE: Drag column A trước column B
    FE->>FE: Tính toán columnOrderIds mới
    FE->>API: PATCH /boards/:id/reorder-columns
    API->>Service: reorderColumns(boardId, orderIds)
    Service->>Service: validateOwner(userId)
    Service->>DB: updateOne({_id: boardId}, {$set: columnOrderIds})
    DB-->>Service: updatedBoard
    Service-->>API: updated order
    API-->>FE: 200 OK
    Service-->>Socket: emit columnReordered(boardId, orderIds)
    Socket-->>FE: Cập nhật UI realtime
```

---

### 4. Module Quản lý Card

**Activity Diagram – Vòng đời Card**

```mermaid
flowchart TB
    A([Bắt đầu]) --> B[Owner/Member mở board]
    B --> C{Hành động?}
    C -->|Tạo card| D[Nhập title, column đích]
    D --> E[Validate + insert card]
    E --> F[Update column.cardOrderIds]
    C -->|Cập nhật card| G[Chỉnh sửa mô tả, cover, members]
    G --> H[Validate markdown, xử lý upload]
    H --> I[Update card + broadcast]
    C -->|Di chuyển card| J[Drag card sang column khác]
    J --> K[Update card.columnId]
    K --> L[Update order của hai column]
    C -->|Bình luận| M[Nhập comment]
    M --> N[Push comment embedded]
    C -->|Lưu trữ| O[Set isArchived=true]
    C -->|Khôi phục| P[Set isArchived=false]
    {F,I,L,N,O,P} --> Q[Emit socket event + ghi lịch sử]
    Q --> R((Kết thúc))
```

**Sequence Diagram – Di chuyển Card**

```mermaid
sequenceDiagram
    participant User
    participant FE as Board UI
    participant API as Card API
    participant Service as Card Service
    participant ColumnSvc as Column Service
    participant DB

    User->>FE: Drag card #123 sang column Done
    FE->>API: PATCH /cards/123/move {columnId, position}
    API->>Service: moveCard(cardId, targetColumn, position)
    Service->>DB: findOne(cardId)
    Service->>ColumnSvc: updateOrder(sourceColumn, targetColumn, cardId, position)
    ColumnSvc->>DB: pull cardId from source.cardOrderIds
    ColumnSvc->>DB: push cardId into target.cardOrderIds at position
    Service->>DB: update card.columnId
    DB-->>Service: updated card
    Service-->>API: card detail
    API-->>FE: 200 OK
    Service-->>Socket: emit cardMoved(boardId, payload)
```

---

### 5. Module Calendar

**Activity Diagram – Quản lý sự kiện**

```mermaid
flowchart TB
    A([Bắt đầu]) --> B[Người dùng chọn tab Lịch]
    B --> C[Tải sự kiện theo board quyền truy cập]
    C --> D{Hành động?}
    D -->|Tạo| E[Mở modal tạo sự kiện]
    E --> F[Nhập title, thời gian, liên kết board]
    F --> G[Validate xung đột thời gian]
    G -->|OK| H[Lưu event vào DB]
    D -->|Sửa| I[Chọn event, mở modal]
    I --> J[Cập nhật trường]
    J --> H
    D -->|Xóa| K[Xác nhận xóa]
    K --> L[Xóa mềm event]
    {H,L} --> M[Reload calendar + thông báo]
    M --> N((Kết thúc))
```

**Sequence Diagram – Tạo sự kiện**

```mermaid
sequenceDiagram
    participant User
    participant FE as Calendar UI
    participant API as Event API
    participant Service as Event Service
    participant DB

    User->>FE: Chọn ngày, nhập event
    FE->>API: POST /events {boardId, startAt, endAt}
    API->>Service: createEvent(dto, userId)
    Service->>Service: ensureUserHasBoard(boardId)
    Service->>DB: insertOne(eventDoc)
    DB-->>Service: eventCreated
    Service-->>API: event detail
    API-->>FE: 201 Created
    Service-->>Socket: emit eventCreated(boardId)
    FE-->>User: Render trên lịch
```

---

### 6. Module AI Suggestions

**Sequence Diagram – AI Suggestion Flow**

```mermaid
sequenceDiagram
    participant User
    participant FE as Board Header
    participant API as AI API
    participant Service as AI Service
    participant Groq as Groq API

    User->>FE: Click "Nhận gợi ý"
    FE->>API: POST /ai/suggestions {boardId, context}
    API->>Service: generateSuggestion(payload, userId)
    Service->>Service: gatherContext(board, cards gần đây)
    Service->>Groq: request(contextPrompt)
    Groq-->>Service: suggestionText
    Service-->>API: suggestion + metadata
    API-->>FE: 200 OK
    FE-->>User: Hiển thị gợi ý, cho phép áp dụng
```

**Flowchart – Quy trình tạo gợi ý**

```mermaid
flowchart TB
    A([Bắt đầu]) --> B[Lấy boardId, card context]
    B --> C[Chuẩn hóa dữ liệu (markdown -> text)]
    C --> D[Xây dựng prompt]
    D --> E[Gọi Groq API]
    E --> F{Thành công?}
    F -->|Không| G[Retry/Thông báo lỗi]
    F -->|Có| H[Hậu xử lý kết quả (split bước)]
    H --> I[Lưu cache ngắn hạn]
    {G,I} --> J[Trả response cho client]
    J --> K((Kết thúc))
```

---

### 7. Module Real-time Updates

**Sequence Diagram – Socket.IO Communication**

```mermaid
sequenceDiagram
    participant User
    participant FE as Board UI
    participant Socket as Socket Client
    participant Gateway as Socket Server
    participant Service as Event Handler

    User->>FE: Mở board #ABC
    FE->>Socket: connect("/boards")
    Socket->>Gateway: authenticate(token)
    Gateway->>Service: verifyToken(token)
    Service-->>Gateway: userInfo
    Gateway-->>Socket: join room boardABC
    User->>FE: Thao tác card
    FE->>Socket: emit cardUpdated(payload)
    Socket->>Gateway: cardUpdated(room, payload)
    Gateway->>Service: handleCardUpdated(payload)
    Service-->>Gateway: broadcast data
    Gateway-->>Socket: emit cardUpdated(room)
    Socket-->>FE: Update UI, toast notification
```

**Activity Diagram – Socket Event Handling**

```mermaid
flowchart TB
    A([Client connect]) --> B[Xác thực token]
    B -->|Hợp lệ| C[Gia nhập room board]
    B -->|Không| D[Từ chối kết nối]
    C --> E{Nhận sự kiện?}
    E -->|cardUpdated| F[Kiểm tra quyền user]
    F -->|OK| G[Update DB + emit đến room]
    F -->|Fail| H[Emit lỗi riêng client]
    E -->|columnMoved| I[Update order + emit]
    E -->|memberPresence| J[Ghi trạng thái online]
    {G,I,J,H} --> E
    D --> K((Kết thúc))
```

