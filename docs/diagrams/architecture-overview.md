## Sơ đồ Kiến trúc Tổng thể

Các sơ đồ mô tả kiến trúc hệ thống quản lý công việc theo mô hình Kanban.

### 1. Sơ đồ Kiến trúc Hệ thống (System Architecture Diagram)

```mermaid
graph TB
    subgraph Client[Client Layer - Frontend]
        Browser[Web Browser]
        React[React Application]
        Redux[Redux Store]
        SocketClient[Socket.IO Client]
    end
    
    subgraph Server[Server Layer - Backend]
        Express[Express.js Server]
        SocketIO[Socket.IO Server]
        Controllers[Controllers]
        Services[Services]
        Middlewares[Middlewares]
    end
    
    subgraph Database[Database Layer]
        MongoDB[(MongoDB Atlas)]
    end
    
    subgraph External[External Services]
        Cloudinary[Cloudinary<br/>Image Storage]
        Brevo[Brevo<br/>Email Service]
        Groq[Groq AI<br/>AI Service]
    end
    
    Browser --> React
    React --> Redux
    React --> SocketClient
    React -->|HTTP/REST API| Express
    SocketClient -->|WebSocket| SocketIO
    
    Express --> Middlewares
    Middlewares --> Controllers
    Controllers --> Services
    Services --> MongoDB
    Services --> Cloudinary
    Services --> Brevo
    Services --> Groq
    
    SocketIO --> Express
    Services -->|Emit Events| SocketIO
    SocketIO -->|Broadcast| SocketClient
    
    style Client fill:#e1f5ff
    style Server fill:#fff4e1
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

**Mô tả:**
- **Client Layer**: React application chạy trên browser, quản lý state với Redux, giao tiếp real-time qua Socket.IO client
- **Server Layer**: Express.js xử lý HTTP requests, Socket.IO xử lý WebSocket connections, kiến trúc 3 tầng (Controllers → Services → Models)
- **Database Layer**: MongoDB Atlas lưu trữ dữ liệu dạng NoSQL
- **External Services**: Cloudinary (images), Brevo (email), Groq (AI suggestions)

### 2. Mô hình Phân lớp (Layered Architecture Diagram)

```mermaid
graph TD
    subgraph Presentation[Presentation Layer - Frontend]
        Pages[Pages Components<br/>/pages/]
        Components[Reusable Components<br/>/components/]
        ReduxState[Redux Store<br/>State Management]
        Context[React Context API<br/>Theme, Confirm]
        Router[React Router v7<br/>Client-side Routing]
    end
    
    subgraph Middleware[Middleware Layer]
        Auth[Auth Middleware<br/>JWT Verification]
        Error[Error Handling<br/>Centralized]
        Upload[Multer Upload<br/>File Processing]
    end
    
    subgraph Business[Business Logic Layer - Backend]
        Controllers[Controllers<br/>/controllers/<br/>Request Handlers]
        Services[Services<br/>/services/<br/>Business Logic]
        Validations[Validations<br/>/validations/<br/>Joi Schemas]
        Providers[Providers<br/>/providers/<br/>JWT, Cloudinary, Brevo, Groq]
    end
    
    subgraph DataAccess[Data Access Layer]
        Models[Models<br/>/models/<br/>Database Operations]
        MongoDB[(MongoDB<br/>Collections:<br/>users, boards, columns, cards, events, invitations)]
    end
    
    Pages --> Components
    Components --> ReduxState
    Components --> Context
    Components --> Router
    Components -->|HTTP Requests| Controllers
    
    Controllers --> Middleware
    Middleware --> Auth
    Middleware --> Error
    Middleware --> Upload
    
    Controllers --> Validations
    Controllers --> Services
    Services --> Providers
    Services --> Models
    
    Models --> MongoDB
    
    style Presentation fill:#e3f2fd,stroke:#0277bd,stroke-width:2px
    style Business fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style DataAccess fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style Middleware fill:#fce4ec,stroke:#c2185b,stroke-width:2px
```

**Mô tả các tầng:**
- **Presentation Layer**: React components, Redux state management, React Context, React Router
- **Business Logic Layer**: Controllers xử lý requests, Services chứa business logic, Validations và Providers
- **Data Access Layer**: Models thao tác với MongoDB collections
- **Middleware Layer**: Xử lý authentication, errors, file uploads

### 3. Sơ đồ Luồng Dữ liệu - HTTP Request (Data Flow Diagram)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Axios
    participant Backend
    participant Middleware
    participant Controller
    participant Service
    participant Model
    participant DB[(MongoDB)]
    
    User->>Frontend: User Action (Click, Submit)
    Frontend->>Axios: API Call (authorizedAxiosInstance)
    Note over Axios: Request Interceptor:<br/>Add loading state,<br/>Send cookies (withCredentials)
    Axios->>Backend: HTTP Request + JWT Cookie
    
    Backend->>Middleware: CORS Check
    Backend->>Middleware: Cookie Parser
    Backend->>Middleware: JSON Parser
    Backend->>Middleware: Auth Middleware (JWT Verify)
    alt Token Valid
        Middleware->>Middleware: Set req.jwtDecoded
    else Token Expired
        Middleware-->>Axios: 410 GONE
        Axios->>Backend: Refresh Token API
        Backend-->>Axios: New Access Token
        Axios->>Backend: Retry Original Request
    else Token Invalid
        Middleware-->>Axios: 401 UNAUTHORIZED
        Axios->>Frontend: Auto Logout
    end
    
    Backend->>Middleware: Validation (Joi Schema)
    alt Validation Pass
        Middleware->>Controller: Validated Request
    else Validation Fail
        Middleware-->>Axios: 422 UNPROCESSABLE_ENTITY
    end
    
    Controller->>Service: Business Logic
    Service->>Service: Check Permissions (Owner/Member)
    Service->>Service: Validate Business Rules (WIP, Duplicate)
    Service->>Model: Database Operation
    Model->>DB: MongoDB Query
    DB-->>Model: Result
    Model-->>Service: Data
    Service->>Service: Process Data
    Service->>Service: Emit Real-time Event (if needed)
    Service-->>Controller: Processed Data
    Controller->>Backend: HTTP Response
    Backend-->>Axios: JSON Response
    
    Note over Axios: Response Interceptor:<br/>Handle errors,<br/>Remove loading state
    Axios-->>Frontend: Data
    Frontend->>Frontend: Update Redux Store
    Frontend-->>User: UI Update
```

### 4. Sơ đồ Luồng Dữ liệu - Real-time Updates (Socket.IO)

```mermaid
sequenceDiagram
    participant User1
    participant Frontend1
    participant SocketClient1
    participant SocketServer
    participant SocketClient2
    participant Frontend2
    participant User2
    participant Backend
    
    User1->>Frontend1: Action (Create Card)
    Frontend1->>Backend: HTTP POST /api/v1/cards
    Backend->>Backend: Process & Save to DB
    Backend->>SocketServer: emitToBoard(boardId, 'BE_CARD_CREATED', data)
    Note over SocketServer: Room: board:{boardId}<br/>Broadcast to all clients in room
    SocketServer->>SocketClient1: Broadcast Event
    SocketServer->>SocketClient2: Broadcast Event
    
    SocketClient1->>Frontend1: Receive 'BE_CARD_CREATED'
    SocketClient2->>Frontend2: Receive 'BE_CARD_CREATED'
    
    Note over Frontend1: useRealtimeCardMove hook<br/>handleCardCreated()
    Frontend1->>Frontend1: Update Redux Store
    Frontend1->>Frontend1: Update activeBoard
    Frontend1-->>User1: UI Update (Optimistic)
    
    Note over Frontend2: useRealtimeCardMove hook<br/>handleCardCreated()
    Frontend2->>Frontend2: Update Redux Store
    Frontend2->>Frontend2: Update activeBoard
    Frontend2-->>User2: UI Update (Real-time)
```

### 5. Sơ đồ Luồng Dữ liệu - Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Axios
    participant Backend
    participant JWTProvider
    participant Bcrypt
    participant DB[(MongoDB)]
    
    Note over User,DB: Login Flow
    User->>Frontend: Enter Email & Password
    Frontend->>Axios: POST /api/v1/users/login
    Axios->>Backend: HTTP Request
    Backend->>DB: Find User by Email
    DB-->>Backend: User Data (with hashed password)
    Backend->>Bcrypt: Compare Password
    Bcrypt-->>Backend: Password Match
    Backend->>JWTProvider: Generate Access Token
    Backend->>JWTProvider: Generate Refresh Token
    JWTProvider-->>Backend: Tokens
    Backend->>Backend: Set httpOnly Cookies<br/>(accessToken, refreshToken)
    Backend-->>Axios: User Data (no password)
    Axios-->>Frontend: Response
    Frontend->>Frontend: Save to Redux Store
    Frontend-->>User: Authenticated
    
    Note over User,DB: Token Refresh Flow
    Frontend->>Backend: API Request (with expired token)
    Backend->>Backend: Auth Middleware
    Backend->>JWTProvider: Verify Access Token
    JWTProvider-->>Backend: Token Expired
    Backend-->>Axios: 410 GONE
    Note over Axios: Response Interceptor<br/>Auto refresh token
    Axios->>Backend: GET /api/v1/users/refresh_token<br/>(with refreshToken cookie)
    Backend->>JWTProvider: Verify Refresh Token
    JWTProvider-->>Backend: Valid
    Backend->>JWTProvider: Generate New Access Token
    JWTProvider-->>Backend: New Access Token
    Backend->>Backend: Set New accessToken Cookie
    Backend-->>Axios: New Access Token
    Axios->>Backend: Retry Original Request
    Backend-->>Axios: Success Response
    Axios-->>Frontend: Data
    Frontend-->>User: Success
```

### 6. Sơ đồ Luồng Dữ liệu - File Upload Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Multer
    participant CloudinaryProvider
    participant Cloudinary[Cloudinary Service]
    participant DB[(MongoDB)]
    
    User->>Frontend: Select File (Avatar/Card Cover)
    Frontend->>Frontend: Validate File (Size, Type)
    Frontend->>Frontend: Create FormData
    Frontend->>Backend: POST /api/v1/users/update<br/>(multipart/form-data)
    
    Backend->>Multer: Process File Upload
    Multer->>Multer: Validate File (10MB limit, allowed types)
    Multer->>Multer: Store in Memory Buffer
    Multer-->>Backend: File Buffer
    
    Backend->>CloudinaryProvider: Upload File
    CloudinaryProvider->>Cloudinary: Upload Stream
    Cloudinary-->>CloudinaryProvider: secure_url
    CloudinaryProvider-->>Backend: secure_url
    
    Backend->>DB: Update Document (user.avatar or card.cover)
    DB-->>Backend: Updated Document
    Backend-->>Frontend: Response with secure_url
    Frontend->>Frontend: Update Redux Store
    Frontend-->>User: UI Update (New Image)
```

---

**Ghi chú:**
- Tất cả các sơ đồ được tạo dựa trên kiến trúc thực tế của hệ thống
- Các luồng dữ liệu mô tả chính xác cách hệ thống xử lý requests và real-time updates
- Sơ đồ có thể được sử dụng trực tiếp trong báo cáo hoặc chuyển đổi sang định dạng khác nếu cần

