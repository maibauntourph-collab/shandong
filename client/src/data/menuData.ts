import { Language } from '../contexts/LanguageContext';

// 메뉴 상세 데이터 타입 정의
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

// Multilingual Data Store
const menuData: Record<Language, ServiceMenu[]> = {
    ko: [
        {
            id: 1,
            category: 'signature',
            title: '중식 식사류',
            subtitle: 'Chinese Noodle & Rice',
            description: '산동만의 수타면과 정통 볶음밥 등 든든한 한 끼 식사',
            features: ['수타면', '직화 볶음', '얼큰한 짬뽕', '담백한 볶음밥'],
            price: '300~',
            emoji: '🍜',
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '면류 (Noodles)',
                    items: [
                        { name: '산동 짜장면 (Shan Dong Jjajangmyeon)', description: 'Black Bean Noodles', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80', features: ['300'] },
                        { name: '산동 간짜장 (Shan Dong Ganjjajang)', description: 'Stir-fried Black Bean Noodles', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80', features: ['400'] },
                        { name: '해물 간짜장 (Seafood Ganjjajang)', description: 'Seafood Black Bean Noodles', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                        { name: '고기 간짜장 (Meat Ganjjajang)', description: 'Meat Black Bean Noodles', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80', features: ['500'] },
                        { name: '산동 짬뽕 (Shan Dong Jjamppong)', description: 'Spicy Seafood Noodle Soup', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', features: ['400'] },
                        { name: '백짬뽕 (White Jjamppong)', description: 'White Seafood Noodle Soup', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80', features: ['400'] },
                        { name: '차돌짬뽕 (Beef Brisket Jjamppong)', description: 'Beef Brisket Spicy Noodle Soup', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                    ]
                },
                {
                    courseName: '식사류 (Rice)',
                    items: [
                        { name: '볶음밥 (Fried Rice)', description: 'Fried Rice', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=800&q=80', features: ['400'] },
                        { name: '잡채밥 (Japchae-bap)', description: 'Stir-fried Glass Noodles with Rice', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172789a?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                        { name: '제육덮밥 (Spicy Pork Rice)', description: 'Spicy Pork over Rice', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                        { name: '새우 볶음밥 (Shrimp Fried Rice)', description: 'Shrimp Fried Rice', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', features: ['400'] },
                        { name: '산동 비빔밥 (Shan Dong Bibimbap)', description: 'Shan Dong Style Bibimbap', image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                        { name: '오징어 덮밥 (Squid Rice)', description: 'Spicy Squid over Rice', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                        { name: '낙지덮밥 (Octopus Rice)', description: 'Spicy Octopus over Rice', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', features: ['500'] },
                    ]
                }
            ],
            notes: ['미니 메뉴는 홀에서만 주문 가능합니다.', '곱빼기 추가 50']
        },
        {
            id: 2,
            category: 'dishes',
            title: '중식 요리부',
            subtitle: 'Chinese Cuisine',
            description: '셰프가 직접 조리하는 산동만의 특별한 중화요리',
            features: ['탕수육', '깐풍기', '유산슬', '칠리새우'],
            price: '450~',
            emoji: '🍖',
            image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '튀김 요리 (Fried Dishes)',
                    items: [
                        { name: '옛날 탕수육 (Sweet & Sour Pork)', description: 'Classic Sweet & Sour Pork', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80', features: ['M 800', 'L 1,200'] },
                        { name: '산동 탕수육 (Shan Dong Sweet & Sour Pork)', description: 'Shan Dong Style Crispy Pork', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80', features: ['M 800', 'L 1,200'] },
                        { name: '마늘 탕수육 (Garlic Sweet & Sour Pork)', description: 'Garlic Flavored Pork', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80', features: ['M 1,000', 'L 1,400'] },
                        { name: '꿔바로우 (Guobaorou)', description: 'Double Cooked Pork Slices', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80', features: ['M 800', 'L 1,200'] },
                        { name: '사천 탕수육 (Szechuan Sweet & Sour Pork)', description: 'Spicy Sweet & Sour Pork', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80', features: ['M 800', 'L 1,200'] },
                        { name: '깐풍기 (Kkanpunggi)', description: 'Spicy Garlic Fried Chicken', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', features: ['M 800', 'L 1,200'] },
                        { name: '유린기 (Yuringi)', description: 'Fried Chicken with Soy Sauce', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', features: ['1,200'] },
                    ]
                },
                {
                    courseName: '일품 요리 (Special Dishes)',
                    items: [
                        { name: '유산슬 (Yusanseul)', description: 'Stir-fried Seafood and Vegetables', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172789a?auto=format&fit=crop&w=800&q=80', features: ['1,000'] },
                        { name: '칠리새우 (Chili Shrimp)', description: 'Shrimp in Chili Sauce', image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80', features: ['1,000'] },
                        { name: '깐쇼새우 (Kkansho Shrimp)', description: 'Deep-fried Shrimp in Sweet Chili Sauce', image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80', features: ['1,000'] },
                        { name: '멘보샤 (Menbosha)', description: 'Fried Shrimp Toast', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172789a?auto=format&fit=crop&w=800&q=80', features: ['1,300'] },
                        { name: '팔보채 (Palbochae)', description: 'Eight Treasure Dish', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172789a?auto=format&fit=crop&w=800&q=80', features: ['1,000'] },
                        { name: '양장피 (Yangjangpi)', description: 'Assorted Seafood and Vegetables with Mustard Sauce', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172789a?auto=format&fit=crop&w=800&q=80', features: ['1,200'] },
                        { name: '고추잡채 (Gochu Japchae)', description: 'Stir-fried Peppers and Pork (with Buns)', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172789a?auto=format&fit=crop&w=800&q=80', features: ['1,200'] },
                        { name: '누룽지탕 (Nurungji Tang)', description: 'Scorched Rice Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', features: ['1,000'] },
                    ]
                }
            ],
            notes: ['미니 요리 주문 가능 (홀 전용)', '모든 메뉴 포장 가능']
        },

        {
            id: 3,
            category: 'specials',
            title: '산동 스페셜 & 한식',
            subtitle: 'Specials & Korean',
            description: '특별한 날을 위한 요리와 정갈한 한식 메뉴',
            features: ['차돌박이', '삼겹살', '전골 요리', '다양한 한식'],
            price: '300~',
            emoji: '🍱',
            image: 'https://images.unsplash.com/photo-1541544744-378c549f1b9a?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '산동 스페셜 (Specials)',
                    items: [
                        { name: '차돌박이 (Beef Brisket)', description: '200g', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', features: ['450'] },
                        { name: '삼겹살 (Pork Belly)', description: '200g', image: 'https://images.unsplash.com/photo-1596450514930-b38fa1b18a38?auto=format&fit=crop&w=800&q=80', features: ['350'] },
                        { name: '제육볶음 (Stir-fried Spicy Pork)', description: 'Spicy Pork Stir-fry', features: ['1,000'] },
                        { name: '오징어볶음 (Stir-fried Squid)', description: 'Spicy Squid Stir-fry', features: ['1,000'] },
                        { name: '낙지소면 (Stir-fried Octopus with Noodles)', description: 'Spicy Octopus with Noodles', features: ['600'] },
                        { name: '닭똥집볶음 (Stir-fried Chicken Gizzard)', description: 'Stir-fried Chicken Gizzard', features: ['600'] },
                        { name: '고등어 자반구이 (Grilled Mackerel)', description: 'Grilled Salted Mackerel', features: ['700'] },
                    ]
                },
                {
                    courseName: '산동 한식류 (Korean Dishes)',
                    items: [
                        { name: '계란말이 (Rolled Omelet)', description: 'Rolled Omelet', features: ['300'] },
                        { name: '떡볶이 (Tteokbokki)', description: 'Spicy Rice Cakes', features: ['500'] },
                        { name: '김밥 (Gimbap)', description: 'Korean Seaweed Rice Roll', features: ['150'] },
                        { name: '참치김밥 (Tuna Gimbap)', description: 'Tuna Gimbap', features: ['200'] },
                        { name: '바지락칼국수 (Clam Kalguksu)', description: 'Noodle Soup with Clams', features: ['400'] },
                        { name: '뚝배기불고기 (Bulgogi Stew)', description: 'Bulgogi in Earthenware Pot', features: ['500'] },
                        { name: '닭개장 (Spicy Chicken Soup)', description: 'Spicy Chicken Soup', features: ['450'] },
                        { name: '육개장 (Spicy Beef Soup)', description: 'Spicy Beef Soup', features: ['450'] },
                        { name: '뼈다귀탕 (Pork Back-bone Stew)', description: 'Pork Bone Stew', features: ['500'] },
                        { name: '갈비탕 (Short Rib Soup)', description: 'Beef Short Rib Soup', features: ['550'] },
                        { name: '김치찌개 (Kimchi Stew)', description: 'Kimchi Stew', image: 'https://images.unsplash.com/photo-1583225214464-9296e022f3a8?auto=format&fit=crop&w=800&q=80', features: ['400'] },
                        { name: '된장찌개 (Soybean Paste Stew)', description: 'Soybean Paste Stew', features: ['400'] },
                        { name: '황태국 (Dried Pollack Soup)', description: 'Dried Pollack Soup', features: ['400'] },
                        { name: '닭도리탕 (Spicy Braised Chicken)', description: 'Spicy Braised Chicken', features: ['1,000'] },
                        { name: '김치전골 (Kimchi Hot Pot)', description: 'Kimchi Hot Pot', features: ['1,000'] },
                    ],
                    notes: ['모든 한식 메뉴는 밥과 반찬이 포함됩니다.']
                },
            ],
        },
        {
            id: 4,
            category: 'sets',
            title: '산동 세트메뉴',
            subtitle: 'Value Set Menus',
            description: '다양한 요리를 합리적인 가격으로 즐기는 실속 세트',
            features: ['2인 세트', '가족 세트', '술안주 세트'],
            price: '800~',
            emoji: '🍱',
            image: 'https://images.unsplash.com/photo-1541544744-378c549f1b9a?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '산동 세트 (Shan Dong Sets)',
                    items: [
                        { name: '세트 A (Set A)', description: '식사 1 + 옛날 탕수육 + 수제 군만두 4pcs', features: ['800'] },
                        { name: '세트 B (Set B)', description: '식사 2 + 옛날 탕수육 + 수제 군만두 4pcs', features: ['1,000'] },
                        { name: '세트 C (Set C)', description: '쟁반짜장 + 산동탕수육 + 산동볶음밥 + 수제군만두 4pcs', features: ['1,200'] },
                        { name: '세트 D (Set D)', description: '미니냉채족발 + 미니칠리새우 + 미니팔보채', features: ['1,500'] },
                        { name: '세트 E (Set E)', description: '식사 2 + 양장피 + 산동탕수육', features: ['2,000'] },
                    ]
                }
            ],
            notes: ['세트 메뉴 구성 변경 불가']
        },
        {
            id: 101,
            category: 'wedding',
            title: '웨딩 & 돌잔치',
            subtitle: 'Wedding & Baby',
            description: '생애 가장 특별한 날, 품격 있는 중식 코스로 하객분들에게 최고의 대접을 선사하세요.',
            features: ['맞춤형 코스 요리', '테이블 세팅', '전문 서버 지원', '주류 리스트'],
            price: '상담 문의',
            emoji: '💍',
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '웨딩 A 코스',
                    items: [
                        { name: '오품 냉채', description: '다섯 가지 재료의 조화로운 전채 요리' },
                        { name: '게살 샥스핀 스프', description: '부드러운 게살과 샥스핀의 조화' },
                        { name: '전가복', description: '온 가족의 복을 기원하는 해산물 요리' },
                        { name: '칠리 중새우', description: '매콤달콤한 소스의 새우 요리' },
                        { name: '탕수육', description: '산동만의 바삭한 식감' },
                        { name: '식사 (짜장/짬뽕)', description: '마무리 식사' },
                        { name: '후식', description: '계절 과일' }
                    ]
                }
            ],
            notes: ['최소 50인 이상 주문 가능', '메뉴 구성을 변경하실 수 있습니다.']
        },
        {
            id: 102,
            category: 'corporate',
            title: '기업 연회',
            subtitle: 'Corporate Banquet',
            description: '성공적인 비즈니스를 위한 격조 높은 식사. 세미나, 송년회 등 기업 행사에 최적화된 서비스입니다.',
            features: ['프레젠테이션 지원', '독립 룸 제공', '코스/뷔페 선택', '법인 카드 결제'],
            price: '상담 문의',
            emoji: '🏢',
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '비즈니스 런치 코스',
                    items: [
                        { name: '삼품 냉채', description: '입맛을 돋우는 세 가지 전채' },
                        { name: '누룽지탕', description: '구수한 누룽지와 해산물' },
                        { name: '유산슬', description: '육류와 해산물의 부드러운 볶음' },
                        { name: '깐풍기', description: '매콤한 마늘 소스 닭고기' },
                        { name: '식사 & 후식', description: '' }
                    ]
                }
            ]
        },
        {
            id: 103,
            category: 'private',
            title: '가족 행사',
            subtitle: 'Family Gathering',
            description: '회갑연, 고희연 등 부모님을 위한 효도 잔치. 편안한 분위기에서 즐기는 정통 중식.',
            features: ['상차림 지원', '기념 사진 촬영', '가족 룸', '어르신 맞춤 메뉴'],
            price: '상담 문의',
            emoji: '🎊',
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '장수 코스',
                    items: [
                        { name: '특선 냉채', description: '' },
                        { name: '동파육', description: '부드럽게 조리된 오향 돼지고기' },
                        { name: '해삼 주스', description: '고급 해삼 요리' },
                        { name: '식사 & 후식', description: '' }
                    ]
                }
            ]
        },
        {
            id: 104,
            category: 'vip',
            title: 'VIP 코스',
            subtitle: 'VIP Exclusive',
            description: '귀한 손님을 위한 최고급 식재료와 수석 셰프의 특별한 요리.',
            features: ['전담 셰프 조리', '최고급 식재료', '프라이빗 서비스', '주류 페어링'],
            price: '상담 문의',
            emoji: '✨',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '황제 코스',
                    items: [
                        { name: '랍스터 냉채', description: '' },
                        { name: '불도장', description: '최고급 보양식' },
                        { name: '자연송이 전복', description: '' },
                        { name: '북경오리', description: '' },
                        { name: '식사 & 후식', description: '' }
                    ]
                }
            ]
        }
    ],
    en: [
        {
            id: 1,
            category: 'signature',
            title: 'Handmade Dumplings & Dim Sum',
            subtitle: 'Signature Handmade Dumplings',
            description: 'Our signature handmade dumplings and dim sum, crafted daily. Enjoy the chewy skin and juicy filling.',
            features: ['Handmade Daily', 'Various Fillings', 'Authentic Style', 'Juicy Perfection'],
            price: '$12.00+',
            emoji: '🥟',
            image: 'https://images.unsplash.com/photo-1541696490-8744a5702d28?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Boiled Dumplings',
                    items: [
                        { name: 'Shan Dong Pork & Vegetable Dumplings', description: 'Our signature dumplings with chives and pork (10 pcs)', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c423c?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Vegetarian Dumplings', description: 'Light dumplings filled with fresh vegetables (10 pcs)' },
                        { name: 'Chicken Dumplings', description: 'Juicy dumplings filled with chicken (10 pcs)' },
                    ]
                },
                {
                    courseName: 'Special Dim Sum',
                    items: [
                        { name: 'Pot Stickers', description: 'Pan-fried juicy dumplings (6 pcs)', image: 'https://images.unsplash.com/photo-1604505191060-f47a61d6706f?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Xiao Long Bao', description: 'Shanghai style soup dumplings with rich broth' },
                        { name: 'Wonton with Spicy Sauce', description: 'Soft wontons topped with our special spicy sauce (10 pcs)' },
                    ]
                },
                {
                    courseName: 'Pancakes & Rolls',
                    items: [
                        { name: 'Green Onion Pancake', description: 'Crispy layered Chinese scallion pancake', image: 'https://images.unsplash.com/photo-1601356616077-695728ae17aa?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Pancake with Leeks', description: 'Handmade pancake stuffed with fragrant leeks' },
                        { name: 'Vegetarian Spring Rolls', description: 'Crispy fried vegetable spring rolls' },
                    ]
                },
            ],
            notes: ['All dumplings are made fresh daily.', 'Please allow 15 minutes for cooking.'],
        },
        {
            id: 2,
            category: 'signature',
            title: 'Hand-Pulled Noodles',
            subtitle: 'Hand-Pulled Noodles',
            description: 'Chewy artisan noodles pulled to order. The best texture you can find, only at Shan Dong.',
            features: ['Pulled to Order', 'Specialty Noodles', 'Rich Broth', 'Various Toppings'],
            price: '$14.00+',
            emoji: '🍜',
            image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Signature Noodles',
                    items: [
                        { name: 'Sesame Paste Noodles', description: 'Chewy noodles with nutty sesame sauce (Best Seller)', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Shan Dong Chow Mein', description: 'Stir-fried noodles with mixed seafood and vegetables' },
                    ]
                },
                {
                    courseName: 'Soup Noodles',
                    items: [
                        { name: 'Szechuan Noodles', description: 'Spicy and rich Szechuan style broth', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Beef Soup Noodles', description: 'Deep beef broth simmered for hours' },
                        { name: 'Wonton Soup Noodles', description: 'Clean broth with soft wontons' },
                    ]
                },
                {
                    courseName: 'Chow Mein',
                    items: [
                        { name: 'Beef Chow Mein', description: 'Stir-fried noodles with tender beef' },
                        { name: 'Shrimp Chow Mein', description: 'Stir-fried noodles with plump shrimp' },
                        { name: 'Chow Fun', description: 'Stir-fried wide rice noodles (Beef/Chicken)' },
                    ]
                },
            ],
            notes: ['Noodle thickness adjustable (Thin/Thick)', 'Spiciness adjustable'],
        },
        {
            id: 3,
            category: 'main',
            title: 'Main Dishes (Meat & Seafood)',
            subtitle: 'Chef\'s Special Main Dishes',
            description: 'Authentic Chinese dishes made with fresh ingredients and chef\'s secret sauces.',
            features: ['Shan Dong Chicken', 'Mongolian Beef', 'Szechuan Prawns', 'Szechuan Cuisine'],
            price: '$24.00+',
            emoji: '🍖',
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Poultry',
                    items: [
                        { name: 'Shan Dong Chicken', description: 'Crispy fried chicken with special soy garlic sauce (Signature)', image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Kung Pao Chicken', description: 'Spicy Szechuan chicken with peanuts and chili' },
                        { name: 'Lemon Chicken', description: 'Fried chicken with tangy lemon sauce' },
                    ]
                },
                {
                    courseName: 'Beef & Pork',
                    items: [
                        { name: 'Mongolian Beef', description: 'Sweet and savory beef stir-fried with green onions', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Sweet & Sour Pork', description: 'Deep fried pork in sweet and sour sauce' },
                        { name: 'Shredded Pork with Chili', description: 'Stir-fried shredded pork with spicy chili' },
                    ]
                },
                {
                    courseName: 'Seafood',
                    items: [
                        { name: 'Walnut Prawns', description: 'Crispy prawns with honey walnut glaze', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Szechuan Prawns', description: 'Prawns in spicy and sweet chili sauce' },
                        { name: 'Salt & Pepper Squid', description: 'Crispy deep fried squid with salt and pepper' },
                    ]
                },
            ],
            notes: ['Rice not included', 'Cooked to order'],
        },
        {
            id: 4,
            category: 'main',
            title: 'Vegetables & Rice',
            subtitle: 'Vegetables & Rice',
            description: 'Fresh vegetable dishes and fluffy fried rice. Various options for vegetarians.',
            features: ['Vegetarian Menu', 'Fried Rice', 'Dry Braised Green Beans', 'Ma Po Tofu'],
            price: '$16.00+',
            emoji: '🍚',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'Vegetables',
                    items: [
                        { name: 'Dry Braised Green Beans', description: 'Spicy and savory Shan Dong style green beans', image: 'https://images.unsplash.com/photo-1565259960244-67f70c793282?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Ma Po Tofu', description: 'Spicy Szechuan style tofu (Vegetarian available)' },
                        { name: 'Szechuan Eggplant', description: 'Eggplant in spicy garlic sauce' },
                    ]
                },
                {
                    courseName: 'Fried Rice',
                    items: [
                        { name: 'Combination Fried Rice', description: 'Fried rice with shrimp, chicken, and pork', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=200&q=80' },
                        { name: 'Shrimp Fried Rice', description: 'Fried rice with plump shrimp' },
                        { name: 'Vegetable Fried Rice', description: 'Light and healthy vegetable fried rice' },
                    ]
                },
                {
                    courseName: 'Soup',
                    items: [
                        { name: 'Hot & Sour Soup', description: 'Spicy and sour thick soup' },
                        { name: 'Egg Flower Soup', description: 'Mild egg drop soup' },
                    ]
                },
            ],
            notes: ['Vegan options available', 'Spiciness adjustable'],
        }
    ],
    // Placeholder for other languages (using English for now to avoid broken layout, can be improved later)
    ja: [
        {
            id: 1,
            category: 'signature',
            title: '手作り餃子 & 点心',
            subtitle: 'Signature Handmade Dumplings',
            description: '山東レストランの自慢、毎日手作りする餃子と点心です。もちもちの皮とジューシーな具をお楽しみください。',
            features: ['毎日手作り', '多様な具材', '伝統的な製法', '肉汁たっぷり'],
            price: '12,000ウォン~',
            emoji: '🥟',
            image: 'https://images.unsplash.com/photo-1541696490-8744a5702d28?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '手作り水餃子 (Boiled Dumplings)',
                    items: [
                        { name: '山東特選餃子 (Pork & Vegetable)', description: 'ニラと豚肉がたっぷり入った代表的な水餃子 (10個)', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c423c?auto=format&fit=crop&w=200&q=80' },
                        { name: '野菜餃子 (Vegetarian)', description: '新鮮な野菜で作ったあっさりとした餃子 (10個)' },
                        { name: '鶏肉餃子 (Chicken)', description: '淡白な鶏肉の肉汁があふれる餃子 (10個)' },
                    ]
                },
                {
                    courseName: '珍味点心 (Special Dim Sum)',
                    items: [
                        { name: '焼き餃子 (Pot Stickers)', description: 'カリッと焼き上げた肉汁たっぷりの焼き餃子 (6個)', image: 'https://images.unsplash.com/photo-1604505191060-f47a61d6706f?auto=format&fit=crop&w=200&q=80' },
                        { name: '小籠包 (Pork Soup Dumplings)', description: '濃厚なスープを含んだ上海式ショーロンポー' },
                        { name: 'ピリ辛ワンタン (Wonton with Spicy Sauce)', description: '特製辛味ソースを添えた柔らかいワンタン (10個)' },
                    ]
                },
                {
                    courseName: '餅 & ロール (Pancakes & Rolls)',
                    items: [
                        { name: 'ネギ餅 (Onion Pancake)', description: '層になったサクサクの中国式ネギ餅', image: 'https://images.unsplash.com/photo-1601356616077-695728ae17aa?auto=format&fit=crop&w=200&q=80' },
                        { name: 'ニラ餅 (Stuffed Pancake with Leeks)', description: '香り高いニラがたっぷり入った手作り餅' },
                        { name: '野菜春巻き (Vegetarian Spring Rolls)', description: 'サクサクに揚げた野菜春巻き' },
                    ]
                },
            ],
            notes: ['すべての餃子は毎朝手作りしています。', '注文を受けてから調理するため、15分ほどかかります。'],
        },
        {
            id: 2,
            category: 'signature',
            title: '手打ち麺料理',
            subtitle: 'Hand-Pulled Noodles',
            description: '注文と同時に打つコシのある手打ち麺。山東レストランが誇る最高の食感。',
            features: ['注文即製麺', '手打ち麺専門', '濃厚スープ', '多様なトッピング'],
            price: '14,000ウォン~',
            emoji: '🍜',
            image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: 'シグネチャー麺料理 (Signature Noodles)',
                    items: [
                        { name: '特製ゴマだれ麺 (Sesame Paste Noodles)', description: '香ばしいゴマだれとコシのある手打ち麺の調和 (Best Seller)', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=200&q=80' },
                        { name: '山東焼きそば (Special Chow Mein)', description: '各種海鮮と野菜を強火で炒めた焼きそば' },
                    ]
                },
                {
                    courseName: 'スープ麺料理 (Soup Noodles)',
                    items: [
                        { name: '四川風チャンポン (Szechuan Noodles)', description: '辛くて濃厚な四川式のスープ', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80' },
                        { name: '牛肉麺 (Beef Soup Noodles)', description: '長時間煮込んだ深い味わいの牛肉スープ' },
                        { name: 'ワンタン麺 (Wonton Soup Noodles)', description: 'あっさりしたスープと柔らかいワンタンの調和' },
                    ]
                },
                {
                    courseName: '焼きそば (Chow Mein)',
                    items: [
                        { name: '牛肉焼きそば (Beef Chow Mein)', description: '柔らかい牛肉とコシのある麺' },
                        { name: '海老焼きそば (Shrimp Chow Mein)', description: 'プリプリの海老が入った焼きそば' },
                        { name: 'チャウフン (Chow Fun)', description: '幅広の米麺炒め (Beef/Chicken)' },
                    ]
                },
            ],
            notes: ['麺の太さ調節可能 (細麺/太麺)', '辛さ調節可能'],
        },
        {
            id: 3,
            category: 'main',
            title: 'メイン料理 (肉類 & 海鮮)',
            subtitle: 'Chef\'s Special Main Dishes',
            description: '新鮮な食材とシェフの秘伝ソースで作る本格中華一品料理。',
            features: ['山東チキン', 'モンゴリアンビーフ', 'エビチリ', '四川料理'],
            price: '24,000ウォン~',
            emoji: '🍖',
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '鶏肉料理 (Poultry)',
                    items: [
                        { name: '山東チキン (Shan Dong Chicken)', description: 'カリッと揚げた鶏肉に特製醤油ニンニクソース (Signature)', image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=200&q=80' },
                        { name: '宮保鶏丁 (Kung Pao Chicken)', description: '辛い唐辛子とピーナッツを添えた四川式鶏肉料理' },
                        { name: 'レモンチキン (Lemon Chicken)', description: '爽やかなレモンソースの鶏の唐揚げ' },
                    ]
                },
                {
                    courseName: '牛肉/豚肉 (Beef & Pork)',
                    items: [
                        { name: 'モンゴリアンビーフ (Mongolian Beef)', description: 'ネギと一緒に炒めた甘辛い牛肉料理', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
                        { name: '酢豚 (Sweet & Sour Pork)', description: '甘酸っぱいソースの豚ロース揚げ' },
                        { name: '魚香肉絲 (Shredded Pork with Chili)', description: 'ピリ辛に炒めた細切り豚肉' },
                    ]
                },
                {
                    courseName: '海鮮 (Seafood)',
                    items: [
                        { name: 'クリームエビ (Walnut Prawns)', description: '甘いクリームソースとクルミの飴炊き', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
                        { name: 'エビチリ (Szechuan Prawns)', description: '甘辛いチリソース' },
                        { name: 'イカの塩胡椒揚げ (Salt & Pepper Squid)', description: '塩コショウで味付けしたサクサクのイカフライ' },
                    ]
                },
            ],
            notes: ['ご飯は別売り', 'すべての料理は注文即調理'],
        },
        {
            id: 4,
            category: 'main',
            title: '野菜 & ご飯類',
            subtitle: 'Vegetables & Rice',
            description: '新鮮な野菜料理とパラパラのチャーハン。ベジタリアンのための多様なオプション。',
            features: ['ベジタリアンメニュー', 'チャーハン', 'インゲン豆炒め', '麻婆豆腐'],
            price: '16,000ウォン~',
            emoji: '🍚',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '野菜料理 (Vegetables)',
                    items: [
                        { name: 'インゲン豆炒め (Dry Braised Green Beans)', description: 'ピリ辛で香ばしい山東の珍味野菜料理', image: 'https://images.unsplash.com/photo-1565259960244-67f70c793282?auto=format&fit=crop&w=200&q=80' },
                        { name: '麻婆豆腐 (Ma Po Tofu)', description: 'ピリ辛の四川式豆腐料理 (肉なし)' },
                        { name: '魚香茄子 (Szechuan Eggplant)', description: 'ピリ辛の魚香ソース茄子料理' },
                    ]
                },
                {
                    courseName: 'チャーハン (Fried Rice)',
                    items: [
                        { name: '山東チャーハン (Combination Fried Rice)', description: 'エビ、鶏肉、豚肉がすべて入った特選チャーハン', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=200&q=80' },
                        { name: '海老チャーハン (Shrimp Fried Rice)', description: 'プリプリの海老が入ったチャーハン' },
                        { name: '野菜チャーハン (Vegetable Fried Rice)', description: '多様な野菜のさっぱりとした味' },
                    ]
                },
                {
                    courseName: 'スープ (Soup)',
                    items: [
                        { name: '酸辣湯 (Hot & Sour Soup)', description: '辛くて酸っぱい食欲をそそるスープ' },
                        { name: '卵スープ (Egg Flower Soup)', description: '柔らかい卵スープ' },
                    ]
                },
            ],
            notes: ['ビーガンオプション可能', '辛さ調節可能'],
        }
    ],
    zh: [
        {
            id: 1,
            category: 'signature',
            title: '手工水饺 & 点心',
            subtitle: 'Signature Handmade Dumplings',
            description: '山东餐厅的骄傲，每天现包的手工水饺和点心。请享受劲道的饺子皮和鲜美的馅料。',
            features: ['手工现包', '多种馅料', '正宗做法', '汤汁饱满'],
            price: '12,000韩元~',
            emoji: '🥟',
            image: 'https://images.unsplash.com/photo-1541696490-8744a5702d28?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '手工水饺 (Boiled Dumplings)',
                    items: [
                        { name: '山东特选水饺 (Pork & Vegetable)', description: '韭菜和猪肉满满的招牌水饺 (10个)', image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c423c?auto=format&fit=crop&w=200&q=80' },
                        { name: '素菜水饺 (Vegetarian)', description: '用新鲜蔬菜调味的清淡水饺 (10个)' },
                        { name: '鸡肉水饺 (Chicken)', description: '充满清淡鸡肉汤汁的水饺 (10个)' },
                    ]
                },
                {
                    courseName: '特色点心 (Special Dim Sum)',
                    items: [
                        { name: '煎饺 (Pot Stickers)', description: '煎得酥脆、汤汁饱满的煎饺 (6个)', image: 'https://images.unsplash.com/photo-1604505191060-f47a61d6706f?auto=format&fit=crop&w=200&q=80' },
                        { name: '小笼包 (Pork Soup Dumplings)', description: '包含浓郁汤汁的上海式小笼包' },
                        { name: '红油抄手 (Wonton with Spicy Sauce)', description: '配上特制辣酱的嫩滑馄饨 (10个)' },
                    ]
                },
                {
                    courseName: '饼 & 卷 (Pancakes & Rolls)',
                    items: [
                        { name: '葱油饼 (Onion Pancake)', description: '层层酥脆的中式葱油饼', image: 'https://images.unsplash.com/photo-1601356616077-695728ae17aa?auto=format&fit=crop&w=200&q=80' },
                        { name: '韭菜盒子 (Stuffed Pancake with Leeks)', description: '充满清香韭菜的手工饼' },
                        { name: '素春卷 (Vegetarian Spring Rolls)', description: '炸得酥脆的蔬菜春卷' },
                    ]
                },
            ],
            notes: ['所有饺子每天早上现包。', '下单后即刻烹饪，需等待15分钟左右。'],
        },
        {
            id: 2,
            category: 'signature',
            title: '手擀面',
            subtitle: 'Hand-Pulled Noodles',
            description: '下单即拉的劲道手擀面。山东餐厅引以为傲的最佳口感。',
            features: ['现点现拉', '手擀面专营', '浓郁汤头', '多种浇头'],
            price: '14,000韩元~',
            emoji: '🍜',
            image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '招牌面食 (Signature Noodles)',
                    items: [
                        { name: '麻酱拌面 (Sesame Paste Noodles)', description: '香浓的芝麻酱和劲道手擀面的完美结合 (Best Seller)', image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=200&q=80' },
                        { name: '山东炒面 (Special Chow Mein)', description: '各种海鲜和蔬菜大火快炒的炒面' },
                    ]
                },
                {
                    courseName: '汤面 (Soup Noodles)',
                    items: [
                        { name: '四川海鲜面 (Szechuan Noodles)', description: '香辣浓郁的川式汤头', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=200&q=80' },
                        { name: '红烧牛肉面 (Beef Soup Noodles)', description: '长时间熬制的深厚牛肉汤底' },
                        { name: '云吞面 (Wonton Soup Noodles)', description: '清爽的汤头和嫩滑云吞的组合' },
                    ]
                },
                {
                    courseName: '炒面类 (Chow Mein)',
                    items: [
                        { name: '牛肉炒面 (Beef Chow Mein)', description: '嫩滑牛肉和劲道面条' },
                        { name: '虾仁炒面 (Shrimp Chow Mein)', description: '放入Q弹虾仁的炒面' },
                        { name: '干炒牛河 (Chow Fun)', description: '宽米粉炒制 (Beef/Chicken)' },
                    ]
                },
            ],
            notes: ['面条粗细可选 (细面/宽面)', '辣度可选'],
        },
        {
            id: 3,
            category: 'main',
            title: '主菜 (肉类 & 海鲜)',
            subtitle: 'Chef\'s Special Main Dishes',
            description: '用新鲜食材和主厨秘制酱料制作的正宗中式一品料理。',
            features: ['山东炸鸡', '蒙古牛肉', '干烧虾仁', '川菜'],
            price: '24,000韩元~',
            emoji: '🍖',
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '鸡肉料理 (Poultry)',
                    items: [
                        { name: '山东炸鸡 (Shan Dong Chicken)', description: '酥脆炸鸡配特制酱油蒜泥酱 (Signature)', image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=200&q=80' },
                        { name: '宫保鸡丁 (Kung Pao Chicken)', description: '放入辣椒和花生的川式鸡肉料理' },
                        { name: '柠檬鸡 (Lemon Chicken)', description: '清爽柠檬酱汁的炸鸡' },
                    ]
                },
                {
                    courseName: '牛肉/猪肉 (Beef & Pork)',
                    items: [
                        { name: '蒙古牛肉 (Mongolian Beef)', description: '和大葱一起爆炒的咸甜牛肉料理', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
                        { name: '糖醋肉 (Sweet & Sour Pork)', description: '酸甜酱汁的里脊肉튀김' },
                        { name: '鱼香肉丝 (Shredded Pork with Chili)', description: '香辣炒制的肉丝' },
                    ]
                },
                {
                    courseName: '海鲜 (Seafood)',
                    items: [
                        { name: '核桃虾球 (Walnut Prawns)', description: '香甜奶油酱和琥珀核桃', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80' },
                        { name: '干烧虾仁 (Szechuan Prawns)', description: '甜辣칠리酱' },
                        { name: '椒盐鱿鱼 (Salt & Pepper Squid)', description: '椒盐调味的酥脆炸鱿鱼' },
                    ]
                },
            ],
            notes: ['米饭另算', '所有料理现点现做'],
        },
        {
            id: 4,
            category: 'main',
            title: '蔬菜 & 饭类',
            subtitle: 'Vegetables & Rice',
            description: '新鲜蔬菜料理和粒粒分明的炒饭。为素食者准备的多种选择。',
            features: ['素食菜单', '炒饭', '干煸四季豆', '麻婆豆腐'],
            price: '16,000韩元~',
            emoji: '🍚',
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
            courses: [
                {
                    courseName: '蔬菜料理 (Vegetables)',
                    items: [
                        { name: '干煸四季豆 (Dry Braised Green Beans)', description: '香辣可口的山东特色蔬菜料理', image: 'https://images.unsplash.com/photo-1565259960244-67f70c793282?auto=format&fit=crop&w=200&q=80' },
                        { name: '麻婆豆腐 (Ma Po Tofu)', description: '香辣川式豆腐料理 (无肉)' },
                        { name: '鱼香茄子 (Szechuan Eggplant)', description: '香辣鱼香酱茄子料理' },
                    ]
                },
                {
                    courseName: '炒饭 (Fried Rice)',
                    items: [
                        { name: '山东炒饭 (Combination Fried Rice)', description: '放入虾仁、鸡肉、猪肉的特选炒饭', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?auto=format&fit=crop&w=200&q=80' },
                        { name: '虾仁炒饭 (Shrimp Fried Rice)', description: '放入Q弹虾仁的炒饭' },
                        { name: '蔬菜炒饭 (Vegetable Fried Rice)', description: '多种蔬菜的清爽味道' },
                    ]
                },
                {
                    courseName: '汤 (Soup)',
                    items: [
                        { name: '酸辣汤 (Hot & Sour Soup)', description: '酸辣开胃的汤' },
                        { name: '蛋花汤 (Egg Flower Soup)', description: '柔滑的蛋花汤' },
                    ]
                },
            ],
            notes: ['提供纯素选项', '辣度可选'],
        }
    ],
};

export const getServiceMenuData = (lang: Language): ServiceMenu[] => {
    return menuData[lang] || menuData['ko'];
};

// Deprecated: default to Korean for backward compatibility
export const serviceMenuData = menuData['ko'];
