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
        'nav.menu': '메뉴',
        'nav.catering': '케이터링',
        'nav.quote': '견적문의',
        'nav.contact': '연락처',

        // Hero
        'hero.headline': 'SHANDONG: THE ART OF FIRE & SOUL',
        'hero.subheadline': '산동의 전통에 뿌리를 둔 정통 한식-중식의 맛. 수제 면부터 시그니처 짬뽕까지, 세부 최고의 미식 경험을 제공합니다.',
        'hero.badge': '심야 시간에도 가능합니다! 오전 4:00까지 영업 (라스트 오더: 04:00 AM)',
        'hero.cta.delivery': '배달 주문하기',
        'hero.cta.reserve': '테이블 예약하기',
        'hero.trust': '⭐ 세부 미식가 평점 4.8 | 11AM - 4AM 연중무휴 영업',

        'trust.location': '📍 A.S. Fortuna 쉘 주유소 지나서 30m',
        'trust.payment': '📱 G-Cash 및 착불 현금 결제 가능',

        // Section 2 - Brand Positioning
        'pos.heritage.title': '한식-중식 요리 헤리티지',
        'pos.heritage.desc': '전통 기술을 현대적인 행사에 맞게 재해석했습니다.',
        'pos.dinein.title': '우아한 매장 식사 경험',
        'pos.dinein.desc': '따스한 인테리어와 푸짐한 양. 단체 모임에 최적입니다.',
        'pos.catering.title': '세부 전 지역 풀서비스 케이터링',
        'pos.catering.desc': '소규모 정찬부터 대규모 기업 연회까지.',

        // Section 3 - Signature Dishes
        'signature.title': '고객들이 사랑하는 시그니처 메뉴',
        'signature.intro': '모든 요리에는 우리의 유산이 담겨 있습니다 — 대담하고 균형 잡힌 공유를 위한 요리. (*Mini 메뉴는 매장 식사 시에만 가능합니다)',
        'signature.sets': '울티메이트 세트 (SET A-E)',
        'signature.sets_desc': '짜장면, 짬뽕, 탕수육의 완벽한 조합으로 즐기는 산동 최고의 구성 (₱800부터).',
        'signature.tangsuyuk': '프리미엄 탕수육',
        'signature.tangsuyuk_desc': '옛날 탕수육과 갈릭 탕수육을 포함한 5가지 스타일의 특별한 맛.',
        'signature.specials': '산동 스페셜',
        'signature.specials_desc': '정성을 다해 조리한 족발, 불족발, 도가니 수육 — 진정한 미식가를 위한 한식의 정수.',
        'signature.more': '전체 메뉴 보기',
        'signature.dish1.name': '짬뽕',
        'signature.dish1.desc': '깊고 시원한 맛의 얼큰한 해산물 국물 요리.',
        'signature.dish2.name': '짜장면',
        'signature.dish2.desc': '풍미 깊은 블랙빈 소스와 쫄깃한 수제 면.',
        'signature.dish3.name': '탕수육',
        'signature.dish3.desc': '산동만의 시그니처 달콤새콤 소스를 곁들인 바삭한 돼지고기.',
        'signature.dish4.name': '산동 치킨',
        'signature.dish4.desc': '바삭한 껍질과 촉촉한 속살, 잊을 수 없는 풍미.',

        // Section 4 - Catering Authority
        'catering.authority.title': '특별한 순간을 위한 품격 있는 케이터링',
        'catering.authority.desc': '가족 행사부터 기업 모임까지, 산동은 전문적인 프리젠테이션과 신뢰할 수 있는 서비스로 품격 있는 한식-중식 요리를 제공합니다. 음식은 저희에게 맡기시고, 소중한 손님들에게 집중하세요.',
        'catering.package.intimate.title': '인티메이트 게더링 패키지',
        'catering.package.celebration.title': '셀레브레이션 피스트 패키지',
        'catering.package.corporate.title': '코퍼레이트 뱅킷 패키지',
        'catering.proposal': '제안서 받기',
        'catering.corporate.badge': '기업 행사 최다 예약',
        'catering.trust': '세부의 수많은 가족, 기업, 이벤트 플래너들이 신뢰합니다.',
        'catering.package.intimate.desc': '4~6인 소규모 모임에 적합 (₱2,500부터) - 짬뽕, 짜장면, 탕수육, 볶음밥 구성',
        'catering.package.celebration.desc': '10~12인 가족 및 친구 모임 (₱5,000부터) - 면 요리 3종, 시그니처 메인, 볶음밥',
        'catering.package.corporate.desc': '15~25인 오피스 이벤트 (맞춤 견적 가능) - 엄선된 메인 요리, 채소, 볶음밥 구성',

        // Section 5 - Restaurant Experience
        'visit.headline': '세부 산동 레스토랑 방문하기',
        'visit.copy': '한식의 따뜻한 환대와 중식 요리의 풍부한 전통이 만나는 아늑한 공간을 경험하세요. 캐주얼한 저녁 식사부터 친구들과의 모임, 가족 축제까지 산동은 편안함과 품격을 동시에 제공합니다.',
        'visit.highlight1': 'Mandaue City, AS Fortuna 위치',
        'visit.highlight2': '프라이빗 단체석 완비',
        'visit.highlight3': '8~30인 규모 모임에 최적',
        'visit.highlight4': '넓은 주차 공간 완비',
        'visit.reserve': '테이블 예약하기',
        'visit.directions': '길 찾기',

        'heritage.copy': '우리의 이야기는 산동 요리의 강렬한 불맛과 한식의 정교한 균형에서 시작됩니다. 따스함과 편안함이 가득한 A.S. Fortuna의 다이닝 공간에서, 우리는 짜장 소스의 예술과 정통의 맛을 완성해 왔습니다. 세부의 다양한 입맛을 사로잡으면서도 뿌리를 지켜온 산동은 소중한 사람들과의 모임을 위한 최고의 선택입니다.',

        // Section 7 - Social Proof
        'social.title': '고객들의 이야기',
        'social.review1.text': '세부 최고의 한식-중식 레스토랑입니다. 아버지 칠순 잔치를 여기서 했는데 모든 것이 완벽했습니다.',
        'social.review1.author': 'Maria L.',
        'social.review2.text': '저희 회사에서 두 번 케이터링을 예약했는데, 항상 신뢰할 수 있고 양도 푸짐하며 프리젠테이션이 훌륭했습니다.',
        'social.review2.author': 'Cebu Corporate Client',

        // Section 8 - Final CTA
        'final.cta.headline': '축제나 기업 행사를 계획 중이신가요?',
        'final.cta.copy': '산동의 전문적인 요리와 오랫동안 기억될 맛으로 소중한 순간을 채워보세요.',

        // Services Page
        'services.title': '고품격 케이터링 & 메뉴',
        'services.subtitle': '모든 특별한 순간에 맞추어 설계된 프리미엄 요리 경험',
        'services.all': '전체보기',
        'services.packages': '케이터링 패키지',
        'services.signature': '시그니처 메뉴',
        'services.corporate': '기업 연회',
        'services.vip': 'VIP 서비스',
        'services.viewDetail': '상세 메뉴 보기',
        'services.getQuote': '견적 문의',
        'services.process.title': '서비스 진행 과정',
        'services.process.subtitle': '문의부터 행사 당일까지 이어지는 완벽한 지원',
        'services.process.step1.title': '상담 & 견적',
        'services.process.step1.desc': '일정과 인원, 예산에 맞춘 최적의 제안을 제공합니다.',
        'services.process.step2.title': '메뉴 맞춤 구성',
        'services.process.step2.desc': '행사 성격에 맞춘 요리 구성과 선호도를 반영합니다.',
        'services.process.step3.title': '전문 서비스 준비',
        'services.process.step3.desc': '최상의 신선도와 품격 있는 프리젠테이션을 준비합니다.',
        'services.process.step4.title': '완벽한 실행',
        'services.process.step4.desc': '행사장에서의 전문적인 케이터링 서비스와 사후 관리.',
        'services.cta.title': '맞춤 제안서가 필요하신가요?',
        'services.cta.subtitle': '간단한 정보를 남겨주시면 담당자가 정식 제안서를 보내드립니다.',

        // Quote Page
        'quote.title': '케이터링 견적 요청',
        'quote.subtitle': '행사에 대해 알려주시면 맞춤형 제안서를 보내드립니다.',
        'quote.formTitle': '견적 문의 양식',
        'quote.eventType': '행사 유형',
        'quote.eventDate': '행사 일자',
        'quote.eventLocation': '행사 장소',
        'quote.guestCount': '예상 인원',
        'quote.cuisine': '선호 요리',
        'quote.budget': '예산 범위',
        'quote.name': '성함',
        'quote.phone': '연락처',
        'quote.facebookName': '페이스북 성함 (선택사항)',
        'quote.message': '세부 내용 및 요청사항',
        'quote.submit': '무료 견적 받기',
        'quote.successTitle': '문의가 접수되었습니다!',
        'quote.successDesc': '곧 담당자가 연락드리겠습니다. 감사합니다.',
        'quote.newQuote': '새로운 문의 보내기',
        'quote.select': '선택하세요',
        'quote.eventTypes.family': '가족 모임',
        'quote.eventTypes.birthday': '생일',
        'quote.eventTypes.wedding': '결혼식',
        'quote.eventTypes.corporate': '기업 행사',
        'quote.eventTypes.church': '교회/커뮤니티',
        'quote.eventTypes.other': '기타',
        'quote.locations.cebu': '세부 시티',
        'quote.locations.mandaue': '만다웨',
        'quote.locations.lapulapu': '라푸라푸',
        'quote.locations.other': '기타',
        'quote.cuisines.korean': '한식',
        'quote.cuisines.chinese': '중식',
        'quote.cuisines.both': '한식 & 중식 모두',
        'quote.budget.range1': '₱5,000 – ₱10,000',
        'quote.budget.range2': '₱10,000 – ₱25,000',
        'quote.budget.range3': '₱25,000 이상',

        // Contact Page
        'contact.title': '연락처',
        'contact.subtitle': '궁금한 점이 있으신가요? 언제든 문의해 주세요.',
        'contact.visit': '방문하기',
        'contact.call': '전화 문의',
        'contact.email': '이메일 문의',
        'contact.kakao': '카카오톡',
        'contact.formTitle': '메시지 보내기',
        'contact.name': '성함',
        'contact.subject': '제목',
        'contact.message': '내용',
        'contact.send': '보내기',
        'contact.sending': '전송 중...',
        'contact.successTitle': '메시지가 전송되었습니다!',
        'contact.successDesc': '확인 후 빠르게 답변드리겠습니다.',
        'contact.newMessage': '새 메시지 작성',
        'contact.faqTitle': '자주 묻는 질문',
        'contact.faq1Q': '케이터링 최소 인원은 몇 명인가요?',
        'contact.faq1A': '일반적으로 4~6인 패키지부터 준비되어 있습니다.',
        'contact.faq2Q': '배달 지역은 어디까지인가요?',
        'contact.faq2A': '세부 시티, 만다웨, 라푸라푸 등 메트로 세부 전 지역 배달 가능합니다.',
        'contact.faq3Q': '주차 공간이 있나요?',
        'contact.faq3A': '네, 매장 앞 및 전용 주차 공간이 넉넉히 완비되어 있습니다.',
        'contact.faq4Q': '예약은 필수인가요?',
        'contact.faq4A': '워크인도 환영하지만, 단체석이나 주말 저녁은 예약을 권장드립니다.',

        // Footer
        'footer.restaurant_name': '산동 레스토랑 & 케이터링',
        'footer.address': 'AS Fortuna, Mandaue City, Cebu',
        'footer.address_detail': '30 meters past Shell Gas Station, A.S. Fortuna, Mandaue City',
        'footer.phone_delivery': '0906-423-7523 (배달 문의)',
        'footer.phone_gcash': '0915-174-0251 (G-Cash)',
        'footer.hours_official': '오전 11:00 – 오전 04:00 (월-일)',
        'footer.copy': '© 2026 Shandong Restaurant',

        'quote.note': '* 표시된 항목은 필수입니다.',
    },

    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.menu': 'Menu',
        'nav.catering': 'Catering',
        'nav.quote': 'Get Quote',
        'nav.contact': 'Contact',

        // Hero
        'hero.headline': 'SHANDONG: THE ART OF FIRE & SOUL',
        'hero.subheadline': 'From hand-pulled noodles to our signature wok-fired Jjamppong, we bring authentic Korean–Chinese flavors rooted in Shandong tradition to your table.',
        'hero.badge': 'LATE-NIGHT CRAVINGS? OPEN UNTIL 4:00 AM (Last Order: 04:00 AM).',
        'hero.cta.delivery': 'ORDER FOR DELIVERY',
        'hero.cta.reserve': 'RESERVE A TABLE',
        'hero.trust': '⭐ Rated 4.8 by Cebu diners | Open 11 AM - 4 AM Daily',

        // Competitive Advantage Bar
        'trust.delivery': '🚚 FREE DELIVERY within the A.S. Fortuna area.',
        'trust.location': '📍 30m past Shell Gas Station, A.S. Fortuna, Mandaue City.',
        'trust.payment': '📱 G-Cash & Cash on Delivery Accepted.',

        // Section 2 - Brand Positioning
        'pos.heritage.title': 'Korean–Chinese Culinary Heritage',
        'pos.heritage.desc': 'Traditional techniques refined for modern celebrations.',
        'pos.dinein.title': 'Elegant Dine-In Experience',
        'pos.dinein.desc': 'Warm interiors. Generous portions. Perfect for gatherings.',
        'pos.catering.title': 'Full-Service Catering Across Metro Cebu',
        'pos.catering.desc': 'From intimate dinners to corporate banquets.',

        // Section 3 - Signature Dishes
        'signature.title': 'Signature Dishes Loved by Our Guests',
        'signature.intro': 'Every dish reflects our heritage — bold, balanced, and crafted for sharing. (*Mini menus available for dine-in only)',
        'signature.sets': 'The Ultimate Sets (SET A-E)',
        'signature.sets_desc': 'The perfect combination of Jajangmyeon, Jjamppong, and Tangsuyuk starting at ₱800.',
        'signature.tangsuyuk': 'Premium Tangsuyuk',
        'signature.tangsuyuk_desc': 'Discover five distinct styles, including our Signature Yetnal (Old-fashioned) and Garlic Tangsuyuk.',
        'signature.specials': 'Shandong Specials',
        'signature.specials_desc': 'Hearty, traditional feasts featuring Jokbal, Bul Jokbal, and Dogani Suyoock braised to perfection.',
        'signature.more': 'Explore Full Menu',
        'signature.dish1.name': 'Jjamppong',
        'signature.dish1.desc': 'Spicy seafood noodle soup with deep, comforting heat.',
        'signature.dish2.name': 'Jajangmyeon',
        'signature.dish2.desc': 'Hand-pulled noodles with rich black bean sauce.',
        'signature.dish3.name': 'Tangsu-yuk',
        'signature.dish3.desc': 'Crispy pork with our signature sweet & sour glaze.',
        'signature.dish4.name': 'Shandong Chicken',
        'signature.dish4.desc': 'Crisp skin, tender meat, unforgettable flavor.',

        // Section 4 - Catering Authority
        'catering.authority.title': 'Elevated Catering for Events That Matter',
        'catering.authority.desc': 'From family milestones to corporate gatherings, Shandong delivers refined Korean–Chinese cuisine with professional presentation and reliable service. We handle the food — so you can focus on your guests.',
        'catering.package.intimate.title': 'Intimate Gathering Package',
        'catering.package.celebration.title': 'Celebration Feast Package',
        'catering.package.corporate.title': 'Corporate Banquet Package',
        'catering.proposal': 'Get Proposal',
        'catering.corporate.badge': 'Most Booked for Corporate Events',
        'catering.trust': 'Trusted by Cebu families, offices, and event planners.',
        'catering.package.intimate.desc': 'Ideal for 4–6 guests (Starts at ₱2,500). Includes: Jjamppong, Jajangmyeon, Tangsu-yuk, Fried Rice',
        'catering.package.celebration.desc': 'Perfect for 10–12 guests (Starts at ₱5,000). Includes 3 noodle dishes, signature mains, rice',
        'catering.package.corporate.desc': 'Designed for office events (Custom pricing available). Includes curated mains, vegetables, rice',

        // Section 5 - Restaurant Experience
        'visit.headline': 'Visit Our Dining Space in Cebu',
        'visit.copy': 'Experience the warmth of Korean hospitality and the richness of Chinese culinary tradition — brought together in one inviting space. Whether it’s a casual dinner, barkada gathering, or family celebration, Shandong offers comfort and refinement in equal measure.',
        'visit.highlight1': 'Located at AS Fortuna, Mandaue City',
        'visit.highlight2': 'Private group seating available',
        'visit.highlight3': 'Perfect for 8–30 guest gatherings',
        'visit.highlight4': 'Ample parking',
        'visit.reserve': 'Reserve a Table',
        'visit.directions': 'Get Directions',

        // Section 6 - Heritage Story
        'heritage.title': 'One Kitchen. Two Traditions. Endless Flavor.',
        'heritage.copy': 'Our story begins with the bold, wok-fired intensity of Shandong cuisine and the refined balance of Korean culinary tradition. Within our inviting A.S. Fortuna dining space—defined by warmth and comfort—we master the art of the dark sauce and the perfect crisp. Honoring authenticity while serving the diverse tastes of Cebu, this is food meant for gathering.',

        // Section 7 - Social Proof
        'social.title': 'What Our Guests Say',
        'social.review1.text': 'Best Korean–Chinese restaurant in Cebu. We celebrated my father’s birthday here and everything was flawless.',
        'social.review1.author': 'Maria L.',
        'social.review2.text': 'Our company booked their catering twice — reliable, generous portions, and beautifully presented.',
        'social.review2.author': 'Corporate Client, Cebu',

        // Section 8 - Final CTA
        'final.cta.headline': 'Planning a Celebration or Corporate Event?',
        'final.cta.copy': 'Let Shandong handle the cuisine with professionalism and flavor your guests will remember.',

        // Services Page
        'services.title': 'Catering & Menu Collections',
        'services.subtitle': 'Explore our refined collection of Korean-Chinese culinary experiences for every occasion.',
        'services.all': 'All Collections',
        'services.packages': 'Catering Packages',
        'services.signature': 'Signature Menu',
        'services.corporate': 'Corporate Banquets',
        'services.vip': 'VIP Exclusive',
        'services.viewDetail': 'View Full Menu',
        'services.getQuote': 'Inquire for Quote',
        'services.process.title': 'Our Process',
        'services.process.subtitle': 'How we ensure a flawless experience from first contact to the last bite.',
        'services.process.step1.title': 'Consultation & Proposal',
        'services.process.step1.desc': 'We discuss your event needs and provide a custom-tailored proposal.',
        'services.process.step2.title': 'Menu Customization',
        'services.process.step2.desc': 'Refining your selection to perfectly match your guests\' preferences.',
        'services.process.step3.title': 'Premium Preparation',
        'services.process.step3.desc': 'Our chefs prepare everything fresh using traditional, high-end techniques.',
        'services.process.step4.title': 'Professional Execution',
        'services.process.step4.desc': 'Full-service catering or delivery with elegant presentation.',
        'services.cta.title': 'Need a Personalized Proposal?',
        'services.cta.subtitle': 'Get in touch today and let us help you plan the perfect banquet.',

        // Quote Page
        'quote.title': 'Request Catering Proposal',
        'quote.subtitle': 'Tell us about your event and we\'ll send you a custom proposal.',
        'quote.formTitle': 'Inquiry Form',
        'quote.eventType': 'Event Type',
        'quote.eventDate': 'Event Date',
        'quote.eventLocation': 'Event Location',
        'quote.guestCount': 'Estimated Guest Count',
        'quote.cuisine': 'Preferred Cuisine',
        'quote.budget': 'Budget Range',
        'quote.name': 'Full Name',
        'quote.phone': 'Phone Number',
        'quote.facebookName': 'Facebook Name (optional)',
        'quote.message': 'Message & Special Requests',
        'quote.submit': 'Get My Free Quote',
        'quote.successTitle': 'Request Received!',
        'quote.successDesc': 'Our team will contact you shortly with a proposal.',
        'quote.newQuote': 'Send Another Request',
        'quote.select': 'Select option',
        'quote.eventTypes.family': 'Family Gathering',
        'quote.eventTypes.birthday': 'Birthday Party',
        'quote.eventTypes.wedding': 'Wedding / Anniversary',
        'quote.eventTypes.corporate': 'Corporate Event',
        'quote.eventTypes.church': 'Church / Community',
        'quote.eventTypes.other': 'Other',
        'quote.locations.cebu': 'Cebu City',
        'quote.locations.mandaue': 'Mandaue City',
        'quote.locations.lapulapu': 'Lapu-Lapu City',
        'quote.locations.other': 'Other Area',
        'quote.cuisines.korean': 'Korean Cuisine',
        'quote.cuisines.chinese': 'Chinese Cuisine',
        'quote.cuisines.both': 'Both Korean & Chinese',
        'quote.budget.range1': '₱5,000 – ₱10,000',
        'quote.budget.range2': '₱10,000 – ₱25,000',
        'quote.budget.range3': '₱25,000+',

        // Contact Page
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Have a question? We\'re here to help.',
        'contact.visit': 'Visit Us',
        'contact.call': 'Call Us',
        'contact.email': 'Email Us',
        'contact.kakao': 'KakaoTalk',
        'contact.formTitle': 'Send a Message',
        'contact.name': 'Full Name',
        'contact.subject': 'Subject',
        'contact.message': 'Message',
        'contact.send': 'Send Message',
        'contact.sending': 'Sending...',
        'contact.successTitle': 'Message Sent!',
        'contact.successDesc': 'We\'ll get back to you within 24 hours.',
        'contact.newMessage': 'Write New Message',
        'contact.faqTitle': 'Frequently Asked Questions',
        'contact.faq1Q': 'What is the minimum guest count for catering?',
        'contact.faq1A': 'We have packages starting from 4–6 guests up to 100+ pax.',
        'contact.faq2Q': 'Which areas in Cebu do you deliver to?',
        'contact.faq2A': 'We deliver across Metro Cebu including Mandaue, Cebu City, and Lapu-Lapu.',
        'contact.faq3Q': 'Do you have parking at the restaurant?',
        'contact.faq3A': 'Yes, we have free ample parking available for all our guests.',
        'contact.faq4Q': 'Do I need to make a reservation?',
        'contact.faq4A': 'While we welcome walk-ins, reservations are recommended for large groups or weekend dinner.',

        // Footer
        'footer.restaurant_name': 'Shandong Restaurant & Catering',
        'footer.address': 'AS Fortuna, Mandaue City, Cebu',
        'footer.address_detail': '30 meters past Shell Gas Station, A.S. Fortuna, Mandaue City',
        'footer.phone_delivery': '0906-423-7523 (Delivery)',
        'footer.phone_gcash': '0915-174-0251 (G-Cash)',
        'footer.hours_official': '11:00 AM – 04:00 AM (Last Order: 04:00 AM)',
        'footer.copy': '© 2026 Shandong Restaurant',

        'quote.note': '* Required fields.',
    },

    ja: {
        'nav.home': 'ホーム',
        'nav.services': '케이터링',
        'nav.quote': '견적문의',
        'nav.contact': '연락처',
        'hero.headline': 'セブ最高の本格韓国風中華料理＆ケータリング',
        'hero.reserve': 'テーブル予約',
        'hero.catering': 'ケータリング見積り',
        'visit.directions': 'アクセス',
        'visit.reserve': 'テーブル予約',
        'footer.copy': '© 2026 Shandong Restaurant',
    },

    zh: {
        'nav.home': '首页',
        'nav.services': '餐饮服务',
        'nav.quote': '获取报价',
        'nav.contact': '联系我们',
        'hero.headline': '宿务地区正宗韩式中华料理与餐饮服务',
        'hero.reserve': '预订餐桌',
        'hero.catering': '获取餐饮报价',
        'visit.directions': '获取路线',
        'visit.reserve': '预订餐桌',
        'footer.copy': '© 2026 Shandong Restaurant',
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
