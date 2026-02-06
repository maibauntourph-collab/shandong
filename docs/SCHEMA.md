# MongoDB 스키마 문서

## 컬렉션 구조

### 1. adminUsers (관리자)
```javascript
{
  _id: ObjectId,
  username: String,        // 로그인 ID (unique)
  password: String,        // MD5 해시 비밀번호
  name: String,            // 이름
  email: String,           // 이메일
  role: String,            // 권한 (admin)
  createdAt: Date,
  lastLogin: Date | null
}
```

### 2. inquiries (문의/예약)
```javascript
{
  _id: ObjectId,
  type: String,            // "quote" | "reservation"
  name: String,            // 고객명
  email: String,           // 이메일
  phone: String,           // 전화번호
  eventType: String,       // "wedding" | "corporate" | "private" | "gala"
  eventDate: Date,         // 행사 날짜
  guestCount: Number,      // 예상 인원
  budget: String,          // 예산
  message: String,         // 상세 내용
  status: String,          // "new" | "contacted" | "confirmed" | "completed" | "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

### 3. chatSessions (AI 챗봇 세션)
```javascript
{
  _id: ObjectId,
  sessionId: String,       // UUID (unique)
  messages: [{
    role: String,          // "user" | "assistant"
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. documents (벡터DB 문서)
```javascript
{
  _id: ObjectId,
  vectorId: String,        // Chroma 문서 ID
  filename: String,        // 원본 파일명
  mimeType: String,        // 파일 타입
  size: Number,            // 파일 크기 (bytes)
  chunkCount: Number,      // 청크 개수
  createdAt: Date
}
```

### 5. notices (공지사항)
```javascript
{
  _id: ObjectId,
  title: String,           // 제목
  content: String,         // 내용
  isPublished: Boolean,    // 게시 여부
  isPinned: Boolean,       // 상단 고정
  createdAt: Date,
  updatedAt: Date
}
```

---

## 초기 데이터 시드

```bash
# MongoDB Shell에서 실행
mongosh < scripts/seed.js
```

## 기본 관리자 계정
- **ID**: admin
- **PW**: admin1234
