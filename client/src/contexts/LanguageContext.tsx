import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en' | 'ja' | 'zh';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 번역 데이터
const translations: Record<Language, Record<string, string>> = {
    ko: {
        // Navigation
        'nav.home': '홈',
        'nav.services': '서비스',
        'nav.quote': '견적문의',
        'nav.contact': '연락처',
        'nav.admin': '관리자',

        // Hero
        'hero.badge': '山東 Chinese Restaurant',
        'hero.title1': '정통 산동식',
        'hero.title2': '프리미엄 중식 케이터링',
        'hero.stats.events': '성공적인 행사',
        'hero.stats.satisfaction': '고객 만족도',
        'hero.description': '40년 전통의 정통 중식 요리와 세심한 서비스로\n잊지 못할 연회를 선사합니다.',
        'hero.cta1': '무료 견적 받기',
        'hero.cta2': '메뉴 보기',

        // Services
        'services.title': '서비스',
        'services.subtitle': '특별한 순간을 위한 맞춤형 중식 케이터링',
        'services.packages_title': '프리미엄 케이터링 패키지',
        'services.packages_subtitle': '성공적인 비즈니스와 특별한 날을 위한 품격 있는 선택',
        'services.all': '전체',
        'services.wedding': '웨딩·돌잔치',
        'services.corporate': '기업 연회',
        'services.private': '가족 행사',
        'services.vip': 'VIP 코스',
        'services.inquire': '문의하기',

        // About
        'about.badge': 'About Us',
        'about.title': '40년 전통의\n정통 산동식 중식',
        'about.description': '산동 레스토랑은 40년간 정통 산동식 중화요리를 선보여온 프리미엄 중식 케이터링 전문 업체입니다.',
        'about.feature1': '본토 출신 중식 조리 명장',
        'about.feature2': '산동성 정통 레시피',
        'about.feature3': '맞춤형 코스 구성',
        'about.feature4': '24시간 상담 가능',

        // Testimonials
        'testimonials.title': '고객 후기',
        'testimonials.subtitle': '산동 레스토랑을 경험한 고객님들의 소중한 이야기입니다.',

        // CTA
        'cta.title': '특별한 순간을 함께 하세요',
        'cta.description': '무료 상담 및 맞춤 견적을 받아보세요.',
        'cta.button': '무료 견적 받기',

        // Quote
        'quote.title': '견적 문의',
        'quote.eventTypes.wedding': '웨딩 케이터링',
        'quote.eventTypes.seminar': '기업 세미나',
        'quote.eventTypes.corporate': '기업 만찬',
        'quote.eventTypes.private': '프라이빗 파티',
        'quote.eventTypes.garden': '가든 파티',
        'quote.eventTypes.gala': '갈라 디너',
        'quote.eventTypes.other': '기타',
        'quote.budget.range1': '100만원 미만',
        'quote.budget.range2': '100만원 ~ 300만원',
        'quote.budget.range3': '300만원 ~ 500만원',
        'quote.budget.range4': '500만원 ~ 1,000만원',
        'quote.budget.range5': '1,000만원 이상',
        'quote.budget.unknown': '미정',
        'quote.subtitle': '행사에 대해 알려주시면 맞춤 견적을 보내드립니다.',
        'quote.name': '이름',
        'quote.email': '이메일',
        'quote.phone': '연락처',
        'quote.eventType': '행사 유형',
        'quote.eventDate': '행사 날짜',
        'quote.guestCount': '예상 인원',
        'quote.budget': '예산',
        'quote.message': '상세 내용',
        'quote.submit': '견적 요청하기',

        // Contact
        'contact.title': '연락처',
        'contact.phone': '전화',
        'contact.email': '이메일',
        'contact.address': '주소',
        'contact.hours': '영업시간',

        // Footer
        'footer.rights': 'All rights reserved.',
        'footer.logoText': '山東 레스토랑',
        'footer.description': '40년 전통의 정통 산동식 중화요리 케이터링',
        'footer.quickLinks': '바로가기',
        'footer.serviceMenu': '서비스',
        'footer.contactMenu': '연락처',
        'footer.brandDesc': '특별한 순간을 위한 프리미엄 외식 서비스.\n정성을 담은 케이터링으로 잊지 못할 경험을 선사합니다.',
        'footer.address': 'Mandaue City, Cebu, Philippines',
        'footer.phone': '+63 (32) XXX-XXXX',
        'footer.hours': '매일 오전 11시 - 오전 5시',
        'footer.link.services': '서비스 안내',
        'footer.link.quote': '견적 문의',
        'footer.link.contact': '연락처',
        'footer.service.wedding': '웨딩 케이터링',
        'footer.service.corporate': '기업 행사',
        'footer.service.private': '프라이빗 파티',
        'footer.service.gala': '갈라 디너',

        // Tagline
        'tagline.main': 'FOOD is not just eating energy. It\'s an EXPERIENCE.',

        // Exchange Rate
        'exchangeRate.loading': '환율 로딩 중...',
        'exchangeRate.phpToKrw': '필리핀 페소 → 한국 원',
        'exchangeRate.usdToKrw': '미국 달러 → 한국 원',

        // Chat
        'chat.title': '산동 레스토랑 AI',
        'chat.placeholder': '메시지를 입력하세요...',
        'chat.available': '24시간 상담 가능',

        // Common
        'common.learnMore': '자세히 보기',
        'common.loading': '로딩 중...',
        'common.error': '오류가 발생했습니다.',

        // Visit Us (New Section)
        'visit.title': '식당 이용 안내',
        'visit.menu_title': '레스토랑 대표 메뉴',
        'visit.menu_subtitle': '40년 전통의 산동 요리를 매장에서 직접 즐겨보세요',
        'visit.subtitle': 'Visit Us',
        'visit.description': '최고급 케이터링 서비스의 품격을\n레스토랑에서도 그대로 느끼실 수 있습니다.',
        'visit.hours': '영업 시간',
        'visit.location': '오시는 길',
        'visit.reservation': '예약 및 문의',
        'visit.weekday': '평일 (Mon-Fri)',
        'visit.weekend': '주말 (Sat-Sun)',
        'visit.breaktime': 'Break Time',
        'visit.lastorder': 'Last Order',
        'visit.closed': '휴무 (Closed)',
        'visit.transport': '지하철: 강남역 1번 출구 도보 5분',
        'visit.parking': '주차: 건물 내 발렛파킹 가능 (3시간 무료)',
        'visit.group': '단체석 (8인~50인) 완비',
        'visit.weekend_res': '주말 예약은 1주일 전 권장',
        'visit.btn_quote': '온라인 견적/예약 문의',
        'visit.menu_preview': '이달의 추천 메뉴',

        // Contact Page Extended
        'contact.subtitle': '언제든지 편하게 연락주세요',
        'contact.visit': '방문 상담',
        'contact.mapView': '지도 보기 →',
        'contact.call': '전화 상담',
        'contact.callAction': '전화 걸기 →',
        'contact.kakao': '카카오톡',
        'contact.kakaoDesc': '실시간 상담',
        'contact.kakaoAction': '채널 추가하기 →',
        'contact.mapPlaceholder': '지도가 여기에 표시됩니다',
        'contact.viewNaver': '네이버 지도에서 보기',
        'contact.monFri': '월 - 금',
        'contact.sat': '토요일',
        'contact.sunHol': '일요일/공휴일',
        'contact.alwaysOpen': '행사 당일에는 24시간 운영합니다.',
        'contact.successTitle': '메시지가 전송되었습니다!',
        'contact.successDesc': '빠른 시일 내에 답변 드리겠습니다.',
        'contact.newMessage': '새 메시지 작성',
        'contact.formTitle': '문의하기',
        'contact.subject': '제목',
        'contact.message': '내용',
        'contact.sending': '전송 중...',
        'contact.send': '메시지 보내기',
        'contact.faqTitle': '자주 묻는 질문',
        'contact.faq1Q': '견적은 어떻게 받을 수 있나요?',
        'contact.faq1A': '견적 문의 페이지에서 양식을 작성하시거나, 24시간 AI 챗봇을 통해 즉시 예상 견적을 확인하실 수 있습니다.',
        'contact.faq2Q': '예약은 얼마나 미리 해야 하나요?',
        'contact.faq2A': '최소 2주 전 예약을 권장드립니다. 성수기(10-11월, 5-6월)에는 1-2개월 전 예약을 추천드립니다.',
        'contact.faq3Q': '시식 서비스가 가능한가요?',
        'contact.faq3A': '네, 계약 전 무료 시식 서비스를 제공해 드립니다. 담당자와 일정을 조율해 주세요.',
        'contact.faq4Q': '취소 및 환불 정책은 어떻게 되나요?',
        'contact.faq4A': '행사 14일 전까지 100% 환불, 7일 전까지 50% 환불이 가능합니다. 자세한 내용은 상담 시 안내드립니다.',

        // Quote Page Extended
        'quote.infoTitle': '빠른 상담 안내',
        'quote.infoDesc': '아래 양식을 작성해 주시면 24시간 이내에 맞춤 견적을 받아보실 수 있습니다.',
        'quote.aiConsult': '24시간 AI 상담',
        'quote.aiDesc': '챗봇으로 언제든지 상담 가능',
        'quote.whyTitle': '산동 레스토랑을 선택하는 이유',
        'quote.why1': '1,500회 이상의 성공적인 행사 경험',
        'quote.why2': '호텔 출신 프리미엄 셰프진',
        'quote.why3': '100% 맞춤형 메뉴 구성',
        'quote.why4': '투명한 가격 정책',
        'quote.why5': '무료 시식 서비스 제공',
        'quote.formTitle': '견적 요청서',
        'quote.select': '선택해주세요',
        'quote.successTitle': '문의가 접수되었습니다!',
        'quote.successDesc': '영업일 기준 24시간 이내에 담당자가 연락드리겠습니다. 빠른 상담을 원하시면 챗봇을 이용해 주세요.',
        'quote.newQuote': '새 문의 작성',
        'quote.note': '* 표시된 항목은 필수입니다. 개인정보는 견적 상담 목적으로만 사용됩니다.',
    },

    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.services': 'Services',
        'nav.quote': 'Get Quote',
        'nav.contact': 'Contact',
        'nav.admin': 'Admin',

        // Hero
        'hero.badge': 'Sandong Chinese Restaurant',
        'hero.title1': 'Authentic Shandong',
        'hero.title2': 'Premium Chinese Catering',
        'hero.stats.events': 'Successful Events',
        'hero.stats.satisfaction': 'Customer Satisfaction',
        'hero.description': '40 years of authentic Chinese cuisine\nand exceptional service for unforgettable events.',
        'hero.cta1': 'Get Free Quote',
        'hero.cta2': 'View Menu',

        // Services
        'services.title': 'Services',
        'services.subtitle': 'Custom Chinese catering for your special moments',
        'services.packages_title': 'Premium Catering Packages',
        'services.packages_subtitle': 'Elegant choices for successful business and special occasions',
        'services.all': 'All',
        'services.wedding': 'Wedding & Baby',
        'services.corporate': 'Corporate',
        'services.private': 'Family Events',
        'services.vip': 'VIP Course',
        'services.inquire': 'Inquire',

        // About
        'about.badge': 'About Us',
        'about.title': '40 Years of\nAuthentic Shandong Cuisine',
        'about.description': 'Sandong Restaurant has been serving authentic Shandong Chinese cuisine for 40 years as a premium catering specialist.',
        'about.feature1': 'Master chefs from mainland China',
        'about.feature2': 'Authentic Shandong recipes',
        'about.feature3': 'Customizable course menus',
        'about.feature4': '24/7 consultation available',

        // Testimonials
        'testimonials.title': 'Testimonials',
        'testimonials.subtitle': 'Precious stories from our valued customers.',

        // CTA
        'cta.title': 'Make Your Moment Special',
        'cta.description': 'Get a free consultation and custom quote.',
        'cta.button': 'Get Free Quote',

        // Quote
        'quote.title': 'Request a Quote',
        'quote.eventTypes.wedding': 'Wedding Catering',
        'quote.eventTypes.seminar': 'Corporate Seminar',
        'quote.eventTypes.corporate': 'Corporate Dinner',
        'quote.eventTypes.private': 'Private Party',
        'quote.eventTypes.garden': 'Garden Party',
        'quote.eventTypes.gala': 'Gala Dinner',
        'quote.eventTypes.other': 'Other',
        'quote.budget.range1': 'Under $1,000',
        'quote.budget.range2': '$1,000 - $3,000',
        'quote.budget.range3': '$3,000 - $5,000',
        'quote.budget.range4': '$5,000 - $10,000',
        'quote.budget.range5': 'Over $10,000',
        'quote.budget.unknown': 'TBD',
        'quote.subtitle': 'Tell us about your event and we\'ll send you a custom quote.',
        'quote.name': 'Name',
        'quote.email': 'Email',
        'quote.phone': 'Phone',
        'quote.eventType': 'Event Type',
        'quote.eventDate': 'Event Date',
        'quote.guestCount': 'Guest Count',
        'quote.budget': 'Budget',
        'quote.message': 'Details',
        'quote.submit': 'Request Quote',

        // Contact
        'contact.title': 'Contact',
        'contact.phone': 'Phone',
        'contact.email': 'Email',
        'contact.address': 'Address',
        'contact.hours': 'Hours',

        // Footer
        'footer.rights': 'All rights reserved.',
        'footer.logoText': 'Sandong Restaurant',
        'footer.description': '40 years of authentic Shandong Chinese cuisine catering',
        'footer.quickLinks': 'Quick Links',
        'footer.serviceMenu': 'Services',
        'footer.contactMenu': 'Contact',
        'footer.brandDesc': 'Premium catering service for your special moments.\nWe deliver unforgettable experiences with sincerity.',
        'footer.address': 'Mandaue City, Cebu, Philippines',
        'footer.phone': '+63 (32) XXX-XXXX',
        'footer.hours': 'Daily 11AM - 5AM',
        'footer.link.services': 'Services',
        'footer.link.quote': 'Get Quote',
        'footer.link.contact': 'Contact Us',
        'footer.service.wedding': 'Wedding Catering',
        'footer.service.corporate': 'Corporate Events',
        'footer.service.private': 'Private Parties',
        'footer.service.gala': 'Gala Dinner',

        // Tagline
        'tagline.main': 'FOOD is not just eating energy. It\'s an EXPERIENCE.',

        // Exchange Rate
        'exchangeRate.loading': 'Loading rates...',
        'exchangeRate.phpToKrw': 'Philippine Peso → Korean Won',
        'exchangeRate.usdToKrw': 'US Dollar → Korean Won',

        // Chat
        'chat.title': 'Sandong AI Assistant',
        'chat.placeholder': 'Type a message...',
        'chat.available': '24/7 Available',

        // Common
        'common.learnMore': 'Learn More',
        'common.loading': 'Loading...',
        'common.error': 'An error occurred.',

        // Visit Us
        'visit.title': 'Visit Us',
        'visit.menu_title': 'Restaurant Signature Menu',
        'visit.menu_subtitle': 'Enjoy authentic Shandong cuisine directly at our restaurant',
        'visit.subtitle': 'Visit Us',
        'visit.description': 'Experience the quality of our premium catering service\ndirectly at our restaurant.',
        'visit.hours': 'Hours',
        'visit.location': 'Location',
        'visit.reservation': 'Reservations',
        'visit.weekday': 'Weekdays',
        'visit.weekend': 'Weekends',
        'visit.breaktime': 'Break Time',
        'visit.lastorder': 'Last Order',
        'visit.closed': 'Closed',
        'visit.transport': 'Subway: Gangnam Stn Exit 1, 5 min walk',
        'visit.parking': 'Parking: Valet parking available (3h free)',
        'visit.group': 'Group seats (8-50) available',
        'visit.weekend_res': 'Weekend reservations recommended 1 week in advance',
        'visit.btn_quote': 'Online Quote/Reservation',
        'visit.menu_preview': 'Chef\'s Recommendations',

        // Contact Page Extended
        'contact.subtitle': 'Feel free to contact us anytime',
        'contact.visit': 'Visit Us',
        'contact.mapView': 'View Map →',
        'contact.call': 'Call Us',
        'contact.callAction': 'Call Now →',
        'contact.kakao': 'KakaoTalk',
        'contact.kakaoDesc': 'Real-time Chat',
        'contact.kakaoAction': 'Add Channel →',
        'contact.mapPlaceholder': 'Map will be displayed here',
        'contact.viewNaver': 'View on Naver Map',
        'contact.monFri': 'Mon - Fri',
        'contact.sat': 'Saturday',
        'contact.sunHol': 'Sun / Holidays',
        'contact.alwaysOpen': 'Open 24h on event days.',
        'contact.successTitle': 'Message Sent!',
        'contact.successDesc': 'We will get back to you shortly.',
        'contact.newMessage': 'Write New Message',
        'contact.formTitle': 'Contact Us',
        'contact.subject': 'Subject',
        'contact.message': 'Message',
        'contact.sending': 'Sending...',
        'contact.send': 'Send Message',
        'contact.faqTitle': 'Frequently Asked Questions',
        'contact.faq1Q': 'How can I get a quote?',
        'contact.faq1A': 'You can fill out the form on the Quote page or get an instant estimate via our 24/7 AI chatbot.',
        'contact.faq2Q': 'How far in advance should I book?',
        'contact.faq2A': 'We recommend booking at least 2 weeks in advance. For peak seasons (Oct-Nov, May-Jun), 1-2 months is recommended.',
        'contact.faq3Q': 'Is tasting available?',
        'contact.faq3A': 'Yes, we offer free tasting service before signing the contract. Please schedule with our manager.',
        'contact.faq4Q': 'What is the cancellation policy?',
        'contact.faq4A': '100% refund up to 14 days before, 50% up to 7 days before the event. Details provided during consultation.',

        // Quote Page Extended
        'quote.infoTitle': 'Quick Consultation Guide',
        'quote.infoDesc': 'Fill out the form below and receive a custom quote within 24 hours.',
        'quote.aiConsult': '24/7 AI Consultation',
        'quote.aiDesc': 'Chat anytime with our AI bot',
        'quote.whyTitle': 'Why Choose Sandong?',
        'quote.why1': 'Over 1,500 successful events',
        'quote.why2': 'Premium chefs from luxury hotels',
        'quote.why3': '100% customizable menus',
        'quote.why4': 'Transparent pricing policy',
        'quote.why5': 'Free tasting service included',
        'quote.formTitle': 'Request Quote',
        'quote.select': 'Please select',
        'quote.successTitle': 'Inquiry Received!',
        'quote.successDesc': 'Our manager will contact you within 24 business hours. Use our chatbot for faster service.',
        'quote.newQuote': 'New Inquiry',
        'quote.note': '* Required fields. Personal info is used for consultation only.',
    },

    ja: {
        // Navigation
        'nav.home': 'ホーム',
        'nav.services': 'サービス',
        'nav.quote': 'お見積り',
        'nav.contact': 'お問い合わせ',
        'nav.admin': '管理者',

        // Hero
        'hero.badge': '山東 Chinese Restaurant',
        'hero.title1': '本格山東式',
        'hero.title2': 'プレミアム中華ケータリング',
        'hero.stats.events': '成功したイベント',
        'hero.stats.satisfaction': '顧客満足度',
        'hero.description': '40年の伝統を持つ本格中華料理と\n細やかなサービスで忘れられない宴を演出します。',
        'hero.cta1': '無料見積もり',
        'hero.cta2': 'メニューを見る',

        // Services
        'services.title': 'サービス',
        'services.subtitle': '特別な瞬間のためのオーダーメイド中華ケータリング',
        'services.packages_title': 'プレミアムケータリングパッケージ',
        'services.packages_subtitle': 'ビジネスの成功と特別な日のための品格ある選択',
        'services.all': 'すべて',
        'services.wedding': 'ウェディング・お祝い',
        'services.corporate': '企業イベント',
        'services.private': '家族行事',
        'services.vip': 'VIPコース',
        'services.inquire': 'お問い合わせ',

        // About
        'about.badge': 'About Us',
        'about.title': '40年の伝統\n本格山東式中華',
        'about.description': '山東レストランは40年間、本格的な山東式中華料理を提供してきたプレミアムケータリング専門店です。',
        'about.feature1': '本場出身の中華料理名人',
        'about.feature2': '山東省の本格レシピ',
        'about.feature3': 'カスタマイズコース',
        'about.feature4': '24時間相談可能',

        // Testimonials
        'testimonials.title': 'お客様の声',
        'testimonials.subtitle': '山東レストランをご利用いただいたお客様の声をご紹介します。',

        // CTA
        'cta.title': '特別な瞬間をご一緒に',
        'cta.description': '無料相談とお見積りをどうぞ。',
        'cta.button': '無料見積もり',

        // Quote
        'quote.title': 'お見積りご依頼',
        'quote.eventTypes.wedding': 'ウェディング',
        'quote.eventTypes.seminar': '企業セミナー',
        'quote.eventTypes.corporate': '企業ディナー',
        'quote.eventTypes.private': 'プライベートパーティー',
        'quote.eventTypes.garden': 'ガーデンパーティー',
        'quote.eventTypes.gala': 'ガラディナー',
        'quote.eventTypes.other': 'その他',
        'quote.budget.range1': '100万ウォン未満',
        'quote.budget.range2': '100万ウォン ~ 300万ウォン',
        'quote.budget.range3': '300万ウォン ~ 500万ウォン',
        'quote.budget.range4': '500万ウォン ~ 1,000万ウォン',
        'quote.budget.range5': '1,000万ウォン以上',
        'quote.budget.unknown': '未定',
        'quote.subtitle': 'イベントの詳細をお知らせいただければ、お見積りをお送りします。',
        'quote.name': 'お名前',
        'quote.email': 'メール',
        'quote.phone': '電話番号',
        'quote.eventType': 'イベントタイプ',
        'quote.eventDate': 'イベント日',
        'quote.guestCount': '予定人数',
        'quote.budget': 'ご予算',
        'quote.message': '詳細',
        'quote.submit': '見積もりを依頼する',

        // Contact
        'contact.title': 'お問い合わせ',
        'contact.phone': '電話',
        'contact.email': 'メール',
        'contact.address': '住所',
        'contact.hours': '営業時間',

        // Footer
        'footer.rights': 'All rights reserved.',
        'footer.logoText': '山東 レストラン',
        'footer.description': '40年の伝統の本格山東式中華ケータリング',
        'footer.quickLinks': 'クイックリンク',
        'footer.serviceMenu': 'サービス',
        'footer.contactMenu': 'お問い合わせ',
        'footer.brandDesc': '特別な瞬間のためのプレミアムケータリングサービス。\n心を込めたサービスで忘れられない体験をお届けします。',
        'footer.address': 'Mandaue City, Cebu, Philippines',
        'footer.phone': '+63 (32) XXX-XXXX',
        'footer.hours': '毎日 午前11時 - 午前5時',
        'footer.link.services': 'サービス案内',
        'footer.link.quote': 'お見積り',
        'footer.link.contact': 'お問い合わせ',
        'footer.service.wedding': 'ウェディングケータリング',
        'footer.service.corporate': '企業イベント',
        'footer.service.private': 'プライベートパーティー',
        'footer.service.gala': 'ガラディナー',

        // Tagline
        'tagline.main': 'FOOD is not just eating energy. It\'s an EXPERIENCE.',

        // Exchange Rate
        'exchangeRate.loading': '為替レート読み込み中...',
        'exchangeRate.phpToKrw': 'フィリピンペソ → 韓国ウォン',
        'exchangeRate.usdToKrw': '米ドル → 韓国ウォン',

        // Chat
        'chat.title': '山東レストラン AI',
        'chat.placeholder': 'メッセージを入力...',
        'chat.available': '24時間対応',

        // Common
        'common.learnMore': '詳しく見る',
        'common.loading': '読み込み中...',
        'common.error': 'エラーが発生しました。',

        // Visit Us
        'visit.title': '店舗案内',
        'visit.menu_title': 'レストラン代表メニュー',
        'visit.menu_subtitle': '40年の伝統を持つ山東料理を店舗で直接お楽しみください',
        'visit.subtitle': 'Visit Us',
        'visit.description': 'プレミアムケータリングの品格を\nレストランでもそのまま感じていただけます。',
        'visit.hours': '営業時間',
        'visit.location': 'アクセス',
        'visit.reservation': 'ご予約・お問い合わせ',
        'visit.weekday': '平日 (月-金)',
        'visit.weekend': '週末 (土-日)',
        'visit.breaktime': '休憩時間',
        'visit.lastorder': 'ラストオーダー',
        'visit.closed': '定休日',
        'visit.transport': '地下鉄：江南駅1番出口 徒歩5分',
        'visit.parking': '駐車：バレーパーキング可能 (3時間無料)',
        'visit.group': '団体席 (8名~50名) 完備',
        'visit.weekend_res': '週末のご予約は1週間前推奨',
        'visit.btn_quote': 'オンライン見積/予約',
        'visit.menu_preview': '今月のおすすめメニュー',
    },

    zh: {
        // Navigation
        'nav.home': '首页',
        'nav.services': '服务',
        'nav.quote': '报价咨询',
        'nav.contact': '联系我们',
        'nav.admin': '管理员',

        // Hero
        'hero.badge': '山东 Chinese Restaurant',
        'hero.title1': '正宗山东式',
        'hero.title2': '高端中式餐饮服务',
        'hero.stats.events': '成功举办活动',
        'hero.stats.satisfaction': '客户满意度',
        'hero.description': '40年传统的正宗中华料理与贴心服务\n为您打造难忘的宴会体验。',
        'hero.cta1': '免费报价',
        'hero.cta2': '查看菜单',

        // Services
        'services.title': '服务',
        'services.subtitle': '为您的特殊时刻量身定制中式餐饮',
        'services.packages_title': '高端餐饮套餐',
        'services.packages_subtitle': '为成功商务和特别日子准备的高品位选择',
        'services.all': '全部',
        'services.wedding': '婚宴·周岁宴',
        'services.corporate': '企业宴会',
        'services.private': '家庭聚会',
        'services.vip': 'VIP套餐',
        'services.inquire': '咨询',

        // About
        'about.badge': '关于我们',
        'about.title': '40年传统\n正宗山东式中餐',
        'about.description': '山东餐厅40年来一直提供正宗山东中华料理，是专业的高端餐饮服务商。',
        'about.feature1': '来自正宗的中华料理大师',
        'about.feature2': '山东省正宗配方',
        'about.feature3': '定制套餐',
        'about.feature4': '24小时咨询服务',

        // Testimonials
        'testimonials.title': '客户评价',
        'testimonials.subtitle': '来自我们尊贵客户的宝贵分享。',

        // CTA
        'cta.title': '让特别时刻更加难忘',
        'cta.description': '获取免费咨询和定制报价。',
        'cta.button': '免费报价',

        // Quote
        'quote.title': '询价',
        'quote.eventTypes.wedding': '婚礼餐饮',
        'quote.eventTypes.seminar': '企业研讨会',
        'quote.eventTypes.corporate': '企业晚宴',
        'quote.eventTypes.private': '私人派对',
        'quote.eventTypes.garden': '花园派对',
        'quote.eventTypes.gala': '晚宴',
        'quote.eventTypes.other': '其他',
        'quote.budget.range1': '100万韩元以下',
        'quote.budget.range2': '100万韩元 ~ 300万韩元',
        'quote.budget.range3': '300万韩元 ~ 500万韩元',
        'quote.budget.range4': '500万韩元 ~ 1,000万韩元',
        'quote.budget.range5': '1,000万韩元以上',
        'quote.budget.unknown': '未定',
        'quote.subtitle': '告诉我们您的活动详情，我们将为您提供定制报价。',
        'quote.name': '姓名',
        'quote.email': '邮箱',
        'quote.phone': '电话',
        'quote.eventType': '活动类型',
        'quote.eventDate': '活动日期',
        'quote.guestCount': '预计人数',
        'quote.budget': '预算',
        'quote.message': '详细信息',
        'quote.submit': '提交询价',

        // Contact
        'contact.title': '联系方式',
        'contact.phone': '电话',
        'contact.email': '邮箱',
        'contact.address': '地址',
        'contact.hours': '营业时间',

        // Footer
        'footer.rights': '版权所有',
        'footer.logoText': '山东 餐厅',
        'footer.description': '40年传统正宗山东中华餐饮服务',
        'footer.quickLinks': '快速链接',
        'footer.serviceMenu': '服务',
        'footer.contactMenu': '联系方式',
        'footer.brandDesc': '为您特别时刻准备的高端餐饮服务。\n用心为您打造难忘的宴会体验。',
        'footer.address': 'Mandaue City, Cebu, Philippines',
        'footer.phone': '+63 (32) XXX-XXXX',
        'footer.hours': '每天 上午11点 - 凌晨5点',
        'footer.link.services': '服务指南',
        'footer.link.quote': '询价',
        'footer.link.contact': '联系我们',
        'footer.service.wedding': '婚礼餐饮',
        'footer.service.corporate': '企业活动',
        'footer.service.private': '私人派对',
        'footer.service.gala': '晚宴',

        // Tagline
        'tagline.main': 'FOOD is not just eating energy. It\'s an EXPERIENCE.',

        // Exchange Rate
        'exchangeRate.loading': '加载汇率中...',
        'exchangeRate.phpToKrw': '菲律宾比索 → 韩元',
        'exchangeRate.usdToKrw': '美元 → 韩元',

        // Chat
        'chat.title': '山东餐厅 AI',
        'chat.placeholder': '输入消息...',
        'chat.available': '24小时在线',

        // Common
        'common.learnMore': '了解更多',
        'common.loading': '加载中...',
        'common.error': '发生错误。',

        // Visit Us
        'visit.title': '门店指南',
        'visit.menu_title': '餐厅招牌菜单',
        'visit.menu_subtitle': '请在店内亲自品尝40年传统的山东料理',
        'visit.subtitle': 'Visit Us',
        'visit.description': '在餐厅也能体验到\n如高级宴会服务般的尊贵享受。',
        'visit.hours': '营业时间',
        'visit.location': '位置',
        'visit.reservation': '预订咨询',
        'visit.weekday': '平日 (周一至周五)',
        'visit.weekend': '周末 (周六至周日)',
        'visit.breaktime': '休息时间',
        'visit.lastorder': '最后点餐',
        'visit.closed': '休息日',
        'visit.transport': '地铁：江南站1号出口 步行5分钟',
        'visit.parking': '停车：代客泊车 (3小时免费)',
        'visit.group': '团体席位 (8-50人)',
        'visit.weekend_res': '周末预订建议提前1周',
        'visit.btn_quote': '在线报价/预订',
        'visit.menu_preview': '本月推荐菜单',
    },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'ko';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const languageNames: Record<Language, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
};
