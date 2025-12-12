## Sơ đồ Thiết kế Database

Các sơ đồ mô tả thiết kế database của hệ thống quản lý công việc theo mô hình Kanban.

### 1. ER Diagram (Entity Relationship Diagram)

Sơ đồ ER mô tả mối quan hệ giữa các entity chính trong hệ thống.

```mermaid
erDiagram
    USER ||--o{ BOARD : "owns/creates"
    USER ||--o{ BOARD : "member of"
    USER ||--o{ INVITATION : "inviter/invitee"
    USER ||--o{ CARD : "assigned to"
    USER ||--o{ EVENT : "creates"
    
    BOARD ||--o{ COLUMN : "contains"
    BOARD ||--o{ CARD : "contains"
    BOARD ||--o{ EVENT : "has"
    BOARD ||--o{ INVITATION : "invited to"
    
    COLUMN ||--o{ CARD : "contains"
    
    CARD ||--o{ COMMENT : "has"
    
    USER {
        ObjectId _id PK
        string email UK
        string username UK
        string password
        string displayName
        ObjectId[] favoriteBoardIds
        boolean isActive
    }
    
    BOARD {
        ObjectId _id PK
        string title
        ObjectId[] ownerIds
        ObjectId[] memberIds
        ObjectId[] columnOrderIds
        boolean wipEnabled
        number wipLimit
    }
    
    COLUMN {
        ObjectId _id PK
        ObjectId boardId FK
        string title
        ObjectId[] cardOrderIds
    }
    
    CARD {
        ObjectId _id PK
        ObjectId boardId FK
        ObjectId columnId FK
        string title
        ObjectId[] memberIds
        Comment[] comments
    }
    
    EVENT {
        ObjectId _id PK
        ObjectId boardId FK
        ObjectId createdBy FK
        date startAt
        date endAt
    }
    
    INVITATION {
        ObjectId _id PK
        ObjectId inviterId FK
        ObjectId inviteeId FK
        Object boardInvitation
    }
```

**Mô tả các mối quan hệ:**
- **USER ↔ BOARD**: Quan hệ nhiều-nhiều qua `ownerIds[]` và `memberIds[]`
- **BOARD ↔ COLUMN**: Quan hệ một-nhiều qua `boardId`
- **BOARD ↔ CARD**: Quan hệ một-nhiều qua `boardId`
- **COLUMN ↔ CARD**: Quan hệ một-nhiều qua `columnId`
- **USER ↔ CARD**: Quan hệ nhiều-nhiều qua `memberIds[]`
- **CARD ↔ COMMENT**: Quan hệ một-nhiều embedded qua `comments[]`
- **BOARD ↔ EVENT**: Quan hệ một-nhiều qua `boardId`
- **USER ↔ EVENT**: Quan hệ một-nhiều qua `createdBy`
- **USER ↔ INVITATION**: Quan hệ một-nhiều qua `inviterId` và `inviteeId`
- **BOARD ↔ INVITATION**: Quan hệ một-nhiều qua `boardInvitation.boardId`

### 2. Database Schema Diagram

Sơ đồ schema chi tiết các collection và các trường dữ liệu chính.

```mermaid
graph TD
    Users["users<br/>────────────<br/>PK _id: ObjectId<br/>UK email: String<br/>UK username: String<br/>password: String<br/>displayName: String<br/>avatar: String<br/>role: String<br/>isActive: Boolean<br/>verifyToken: String<br/>favoriteBoardIds: ObjectId[]<br/>createAt / updateAt: Date<br/>_destroy: Boolean"]
    Boards["boards<br/>────────────<br/>PK _id: ObjectId<br/>title: String<br/>slug: String<br/>description: String<br/>ownerIds: ObjectId[] (FK)<br/>memberIds: ObjectId[] (FK)<br/>columnOrderIds: ObjectId[]<br/>backgroundColor: String<br/>wipEnabled: Boolean<br/>wipLimit: Number<br/>createdAt / updatedAt: Date<br/>lastAccessedAt: Date<br/>_destroy: Boolean"]
    Columns["columns<br/>────────────<br/>PK _id: ObjectId<br/>boardId: ObjectId (FK)<br/>title: String<br/>bgColumn: String<br/>bgTitleColumn: String<br/>cardOrderIds: ObjectId[]<br/>createdAt / updatedAt: Date<br/>_destroy: Boolean"]
    Cards["cards<br/>────────────<br/>PK _id: ObjectId<br/>boardId: ObjectId (FK)<br/>columnId: ObjectId (FK)<br/>title: String<br/>description: String<br/>cover: String<br/>memberIds: ObjectId[] (FK)<br/>comments: Embedded[]<br/>isArchived: Boolean<br/>archivedAt: Date<br/>createdAt / updatedAt: Date<br/>_destroy: Boolean"]
    Events["events<br/>────────────<br/>PK _id: ObjectId<br/>boardId: ObjectId (FK)<br/>createdBy: ObjectId (FK)<br/>title: String<br/>description: String<br/>startAt: Date<br/>endAt: Date<br/>allDay: Boolean<br/>timeText: String<br/>color: String<br/>createdAt / updatedAt: Date<br/>_destroy: Boolean"]
    Invitations["invitations<br/>────────────<br/>PK _id: ObjectId<br/>inviterId: ObjectId (FK)<br/>inviteeId: ObjectId (FK)<br/>type: String<br/>boardInvitation.boardId: ObjectId (FK)<br/>boardInvitation.status: String<br/>createdAt / updatedAt: Date<br/>_destroy: Boolean"]
    
    Boards -.->|ownerIds, memberIds| Users
    Columns -.->|boardId| Boards
    Cards -.->|boardId| Boards
    Cards -.->|columnId| Columns
    Cards -.->|memberIds| Users
    Events -.->|boardId| Boards
    Events -.->|createdBy| Users
    Invitations -.->|inviterId, inviteeId| Users
    Invitations -.->|boardInvitation.boardId| Boards
    
    classDef users fill:#e3f2fd,stroke:#90caf9,stroke-width:1px;
    classDef boards fill:#fff3e0,stroke:#ffcc80,stroke-width:1px;
    classDef columns fill:#e8f5e9,stroke:#a5d6a7,stroke-width:1px;
    classDef cards fill:#fce4ec,stroke:#f48fb1,stroke-width:1px;
    classDef events fill:#f3e5f5,stroke:#ce93d8,stroke-width:1px;
    classDef invitations fill:#e0f2f1,stroke:#80cbc4,stroke-width:1px;
    
    class Users users;
    class Boards boards;
    class Columns columns;
    class Cards cards;
    class Events events;
    class Invitations invitations;
```

**Mô tả các collection:**
- **users**: Quản lý thông tin người dùng, xác thực, danh sách board yêu thích
- **boards**: Quản lý board, thành viên (owner/member), cấu hình WIP, thứ tự columns
- **columns**: Quản lý columns trong board, thứ tự cards
- **cards**: Quản lý cards, thành viên được gán, comments (embedded)
- **events**: Quản lý sự kiện liên kết với board, hiển thị trên lịch
- **invitations**: Quản lý lời mời tham gia board

### 3. Mối quan hệ giữa các Collection (Relationship Diagram)

Sơ đồ mô tả chi tiết các mối quan hệ giữa các collection.

```mermaid
graph LR
    subgraph User[User]
        U[users collection]
    end
    
    subgraph Board[Board]
        B[boards collection]
    end
    
    subgraph Column[Column]
        C[columns collection]
    end
    
    subgraph Card[Card]
        CD[cards collection]
    end
    
    subgraph Event[Event]
        E[events collection]
    end
    
    subgraph Invitation[Invitation]
        I[invitations collection]
    end
    
    U -->|ownerIds & memberIds| B
    U -->|memberIds| CD
    U -->|createdBy| E
    U -->|inviterId & inviteeId| I
    
    B -->|boardId| C
    B -->|boardId| CD
    B -->|boardId| E
    B -->|boardInvitation.boardId| I
    
    C -->|columnId| CD
    
    style User fill:#e3f2fd
    style Board fill:#fff3e0
    style Column fill:#e8f5e9
    style Card fill:#fce4ec
    style Event fill:#f3e5f5
    style Invitation fill:#e0f2f1
```

**Loại quan hệ:**
- **Referenced Relationships**: Quan hệ tham chiếu qua ObjectId (USER ↔ BOARD, BOARD ↔ COLUMN, BOARD ↔ CARD, COLUMN ↔ CARD, USER ↔ CARD, BOARD ↔ EVENT, USER ↔ EVENT, USER ↔ INVITATION, BOARD ↔ INVITATION)
- **Embedded Relationships**: Quan hệ nhúng (CARD ↔ COMMENT - comments được nhúng trong document card)
- **Order Management**: Quản lý thứ tự qua mảng `orderIds` (`boards.columnOrderIds[]`, `columns.cardOrderIds[]`)

### 4. Bảng tổng hợp mối quan hệ

| Collection A | Quan hệ | Collection B | Loại quan hệ | Cách thực hiện |
|--------------|---------|--------------|--------------|----------------|
| users | ↔ | boards | Nhiều-nhiều | `boards.ownerIds[]`, `boards.memberIds[]` |
| boards | → | columns | Một-nhiều | `columns.boardId` |
| boards | → | cards | Một-nhiều | `cards.boardId` |
| columns | → | cards | Một-nhiều | `cards.columnId` |
| users | ↔ | cards | Nhiều-nhiều | `cards.memberIds[]` |
| cards | → | comments | Một-nhiều | `cards.comments[]` (embedded) |
| boards | → | events | Một-nhiều | `events.boardId` |
| users | → | events | Một-nhiều | `events.createdBy` |
| users | → | invitations | Một-nhiều | `invitations.inviterId`, `invitations.inviteeId` |
| boards | → | invitations | Một-nhiều | `invitations.boardInvitation.boardId` |

**Ghi chú:**
- PK: Primary Key
- FK: Foreign Key
- UK: Unique Key
- Embedded: Dữ liệu được nhúng trực tiếp trong document
- Array: Mảng ObjectId để quản lý quan hệ nhiều-nhiều hoặc thứ tự

