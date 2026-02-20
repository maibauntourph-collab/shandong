import { Language } from '../contexts/LanguageContext';

export interface MenuItem {
    name: string;
    description?: string;
    image?: string;
    features?: string[];
}

export interface CourseDetail {
    courseName: string;
    items: MenuItem[];
}

export interface ServiceMenu {
    id: number;
    category: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    price: string;
    emoji: string;
    image: string;
    courses: CourseDetail[];
    notes?: string[];
}

const menuData: Record<Language, ServiceMenu[]> = {
    ko: [
        {
            id: 11,
            category: 'packages',
            title: '인티메이트 게더링 패키지',
            subtitle: 'Intimate Gathering (4-6 pax)',
            description: '소규모 가족 모임이나 친구들과의 오붓한 저녁 식사를 위한 완벽한 구성.',
            features: ['4~6인 분량', '가성비 패키지', '대표 메뉴 포함', '배달 가능'],
            price: '₱3,500',
            emoji: '🏠',
            image: 'https://images.unsplash.com/photo-1541544744-378c549f1b9a?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '포함 메뉴',
                    items: [
                        { name: '산동 탕수육 (L)', description: '바삭한 돼지고기와 시그니처 소스' },
                        { name: '짜장면 2그릇', description: '수제 면과 풍미 깊은 소스' },
                        { name: '짬뽕 1그릇', description: '시원하고 매콤한 해산물 국물' },
                        { name: '볶음밥 (L)', description: '고소한 중식 볶음밥' },
                        { name: '군만두 (8pcs)', description: '겉바속촉 수제 군만두' }
                    ]
                }
            ]
        },
        {
            id: 12,
            category: 'packages',
            title: '셀레브레이션 피스트 패키지',
            subtitle: 'Celebration Feast (10-12 pax)',
            description: '생일 파티나 특별한 축하 자리를 위한 풍성한 한식-중식 연회 요리.',
            features: ['10~12인 분량', '베스트셀러 모음', '다양한 메인 요리', '세부 전지역 배달'],
            price: '₱7,500',
            emoji: '🎉',
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '메인 메뉴',
                    items: [
                        { name: '산동 탕수육 (Extra L)', description: '' },
                        { name: '깐풍기 (L)', description: '매콤한 마늘 소스 닭요리' },
                        { name: '유산슬 (L)', description: '해산물과 육류의 부드러운 조화' },
                        { name: '해물 짬뽕 전골', description: '푸짐한 해산물이 담긴 전골' }
                    ]
                },
                {
                    courseName: '식사 & 사이드',
                    items: [
                        { name: '대형 볶음밥 플래터', description: '' },
                        { name: '잡채밥 플래터', description: '' },
                        { name: '수제 만두 모듬 (20pcs)', description: '' }
                    ]
                }
            ]
        },
        {
            id: 13,
            category: 'corporate',
            title: '코퍼레이트 뱅킷 패키지',
            subtitle: 'Corporate Banquet (20+ pax)',
            description: '기업 워크숍, 컨벤션, 오피스 파티를 위한 전문적인 케이터링 서비스.',
            features: ['20인 이상', '맞춤형 메뉴 구성', '프리미엄 세팅', '법인 결제 지원'],
            price: '인당 ₱650~',
            emoji: '🏢',
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '엄선된 메인 요리',
                    items: [
                        { name: '산동 시그니처 탕수육', description: '' },
                        { name: '양장피', description: '톡 쏘는 맛의 고급 전체요리' },
                        { name: '팔보채', description: '여덟 가지 진귀한 해산물 볶음' },
                        { name: '칠리 중새우', description: '' }
                    ]
                }
            ]
        },
        {
            id: 1,
            category: 'signature',
            title: '산동 시그니처 짬뽕',
            subtitle: 'Signature Jjamppong',
            description: '매일 아침 우려내는 진한 육수와 신선한 배부 해산물의 만남.',
            features: ['당일 육수', '세부 신선 해산물', '수제 면'],
            price: '₱400',
            emoji: '🍜',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '옵션',
                    items: [
                        { name: '해물 짬뽕', description: 'Classic Seafood' },
                        { name: '차돌 짬뽕', description: 'Beef Brisket' },
                        { name: '백짬뽕', description: 'White Broth' }
                    ]
                }
            ]
        }
    ],
    en: [
        {
            id: 11,
            category: 'packages',
            title: 'Intimate Gathering Package',
            subtitle: 'Ideal for 4-6 Guests',
            description: 'The perfect selection for small family dinners or cozy gatherings with friends.',
            features: ['Serves 4–6', 'Value-focused', 'Best of Shandong', 'Ready for Delivery'],
            price: '₱3,500',
            emoji: '🏠',
            image: 'https://images.unsplash.com/photo-1541544744-378c549f1b9a?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Included Items',
                    items: [
                        { name: 'Shandong Tangsu-yuk (L)', description: 'Crispy pork with our signature sweet & sour glaze' },
                        { name: '2 bowls of Jajangmyeon', description: 'Hand-pulled noodles with rich black bean sauce' },
                        { name: '1 bowl of Jjamppong', description: 'Spicy seafood noodle soup' },
                        { name: 'Fried Rice (L)', description: 'Savory Chinese-style fried rice' },
                        { name: 'Handmade Dumplings (8pcs)', description: 'Crispy pan-fried dumplings' }
                    ]
                }
            ]
        },
        {
            id: 12,
            category: 'packages',
            title: 'Celebration Feast Package',
            subtitle: 'Ideal for 10-12 Guests',
            description: 'An expansive banquet designed for birthdays, anniversaries, and milestones.',
            features: ['Serves 10–12', 'Bestsellers Bundle', 'Premium Mains', 'Cebu-wide Delivery'],
            price: '₱7,500',
            emoji: '🎉',
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Main Highlights',
                    items: [
                        { name: 'Shandong Tangsu-yuk (Extra L)', description: 'Our most loved crispy pork' },
                        { name: 'Kkanpunggi (L)', description: 'Spicy garlic fried chicken' },
                        { name: 'Yusanseul (L)', description: 'Stir-fried seafood and meats' },
                        { name: 'Seafood Jjamppong Hot Pot', description: 'A massive pot of premium seafood soup' }
                    ]
                },
                {
                    courseName: 'Grains & Sides',
                    items: [
                        { name: 'Large Fried Rice Platter', description: '' },
                        { name: 'Japchae-bap Platter', description: 'Glass noodles and rice' },
                        { name: 'Handmade Dumpling Set (20pcs)', description: '' }
                    ]
                }
            ]
        },
        {
            id: 13,
            category: 'corporate',
            title: 'Corporate Banquet Package',
            subtitle: 'Starting from 20 Pax',
            description: 'Professional catering services for office parties, conventions, and seminars.',
            features: ['20+ Pax', 'Customizable Menu', 'Premium Setup', 'Corporate Billing Available'],
            price: 'From ₱650/pax',
            emoji: '🏢',
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Main Selection',
                    items: [
                        { name: 'Shandong Signature Tangsu-yuk', description: '' },
                        { name: 'Yangjangpi', description: 'Assorted seafood & vegetables with mustard sauce' },
                        { name: 'Palbochae', description: 'Eight Treasure Dish' },
                        { name: 'Chili Prawns', description: '' }
                    ]
                }
            ]
        },
        {
            id: 1,
            category: 'signature',
            title: 'Signature Jjamppong',
            subtitle: 'The Soul of Shandong',
            description: 'Daily simmered broth paired with fresh catches from the Cebu sea.',
            features: ['Fresh Dailly Broth', 'Cebu Fresh Seafood', 'Handmade Noodles'],
            price: '₱400',
            emoji: '🍜',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Variations',
                    items: [
                        { name: 'Seafood Jjamppong', description: 'Classic Spicy' },
                        { name: 'Beef Brisket Jjamppong', description: 'Rich & Savory' },
                        { name: 'White Jjamppong', description: 'Mild Umami' }
                    ]
                }
            ]
        }
    ],
    ja: [],
    zh: []
};

// Fill ja/zh with English for now
menuData.ja = menuData.en;
menuData.zh = menuData.en;

export const getServiceMenuData = (lang: Language): ServiceMenu[] => {
    return menuData[lang] || menuData['ko'];
};

export const serviceMenuData = menuData['ko'];
