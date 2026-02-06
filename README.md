# Out Catering - 외식사업 견적 문의 시스템

프리미엄 케이터링 서비스를 위한 견적 문의 및 AI 상담 시스템입니다.

## 🚀 시작하기

### 필수 요구사항
- Node.js 18+
- MongoDB
- (선택) Chroma 벡터 DB

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 실제 값 입력 (GEMINI_API_KEY, MONGODB_URI 등)

# 개발 서버 시작
npm run dev
```

## 📁 프로젝트 구조

```
out_catering/
├── client/                 # 프론트엔드 (React + TypeScript)
│   ├── src/
│   │   ├── components/     # 재사용 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── hooks/          # 커스텀 훅
│   │   └── styles/         # CSS 스타일
│   └── index.html
├── server/                 # 백엔드 (Express + TypeScript)
│   ├── routes/             # API 라우트
│   └── services/           # 비즈니스 로직
├── shared/                 # 공유 타입
└── package.json
```

## 🎨 주요 기능

### 고객용
- ✨ 럭셔리 파스텔 디자인
- 💬 24시간 AI 챗봇 상담
- 📝 견적 문의 양식
- 📞 연락처 및 서비스 안내

### 관리자용 (/admin)
- 📊 대시보드
- 📁 문서/벡터DB 관리
- 👥 고객 관리
- 📝 문의/예약 관리
- 📢 게시판 관리

## 🔧 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React, TypeScript, Vite |
| 백엔드 | Express, TypeScript |
| DB | MongoDB |
| AI | Google Gemini |
| 벡터DB | Chroma |

## 📄 API 엔드포인트

- `POST /api/chat` - AI 챗봇 대화
- `POST /api/inquiries` - 견적 문의 접수
- `POST /api/documents/upload` - 문서 업로드
- `POST /api/admin/login` - 관리자 로그인
- `GET /api/admin/stats` - 대시보드 통계

## 🔐 기본 관리자 계정

- ID: `admin`
- PW: `admin1234`

## 📜 라이선스

MIT License
