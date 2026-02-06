// MongoDB 초기 데이터 시드 스크립트
// 사용법: mongosh < scripts/seed.js

// 데이터베이스 선택
use outcatering;

// 기존 컬렉션 삭제 (선택)
// db.adminUsers.drop();
// db.inquiries.drop();
// db.notices.drop();
// db.documents.drop();
// db.chatSessions.drop();

// 1. 관리자 계정 생성
db.adminUsers.insertOne({
    username: "admin",
    password: "240be518fabd2724ddb6f04eeb9d5b7a", // admin1234 (MD5)
    name: "관리자",
    email: "admin@outcatering.com",
    role: "admin",
    createdAt: new Date(),
    lastLogin: null
});

print("✅ 관리자 계정 생성 완료");

// 2. 샘플 문의 데이터
db.inquiries.insertMany([
    {
        type: "quote",
        name: "김서연",
        email: "kim.seoyeon@example.com",
        phone: "010-1234-5678",
        eventType: "wedding",
        eventDate: new Date("2026-05-15"),
        guestCount: 100,
        budget: "8000000",
        message: "웨딩 케이터링 견적 문의드립니다. 5월 중순 예정이고 야외 웨딩입니다.",
        status: "new",
        createdAt: new Date()
    },
    {
        type: "quote",
        name: "박준혁",
        email: "park.jh@company.com",
        phone: "010-9876-5432",
        eventType: "corporate",
        eventDate: new Date("2026-03-20"),
        guestCount: 50,
        budget: "3000000",
        message: "기업 세미나 런치 케이터링 견적 부탁드립니다.",
        status: "contacted",
        createdAt: new Date(Date.now() - 86400000)
    },
    {
        type: "reservation",
        name: "이은지",
        email: "lee.ej@gmail.com",
        phone: "010-5555-1234",
        eventType: "private",
        eventDate: new Date("2026-04-01"),
        guestCount: 20,
        budget: "1500000",
        message: "생일파티 홈파티 케이터링 예약합니다.",
        status: "confirmed",
        createdAt: new Date(Date.now() - 172800000)
    }
]);

print("✅ 샘플 문의 데이터 생성 완료");

// 3. 공지사항 데이터
db.notices.insertMany([
    {
        title: "2026년 신년 프로모션 안내",
        content: "새해를 맞이하여 모든 케이터링 서비스 10% 할인 이벤트를 진행합니다.\n\n• 기간: 2026년 1월 1일 ~ 2월 28일\n• 대상: 모든 신규 예약 고객\n• 할인: 총 금액의 10%\n\n많은 관심 부탁드립니다.",
        isPublished: true,
        isPinned: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: "봄 시즌 신메뉴 출시",
        content: "봄을 맞이하여 신선한 제철 재료로 구성된 봄 시즌 메뉴가 출시되었습니다.\n\n자세한 메뉴 구성은 상담 시 안내드리겠습니다.",
        isPublished: true,
        isPinned: false,
        createdAt: new Date(Date.now() - 604800000),
        updatedAt: new Date(Date.now() - 604800000)
    }
]);

print("✅ 공지사항 데이터 생성 완료");

// 4. 인덱스 생성
db.inquiries.createIndex({ status: 1 });
db.inquiries.createIndex({ createdAt: -1 });
db.inquiries.createIndex({ email: 1 });

db.chatSessions.createIndex({ sessionId: 1 }, { unique: true });
db.chatSessions.createIndex({ createdAt: -1 });

db.documents.createIndex({ vectorId: 1 });
db.documents.createIndex({ createdAt: -1 });

db.adminUsers.createIndex({ username: 1 }, { unique: true });

db.notices.createIndex({ isPublished: 1, isPinned: -1, createdAt: -1 });

print("✅ 인덱스 생성 완료");

print("\n🎉 모든 초기 데이터가 성공적으로 생성되었습니다!");
print("관리자 로그인: admin / admin1234");
