import { useState } from 'react';
import { Link } from 'wouter';
import { getServiceMenuData, ServiceMenu } from '../data/menuData';
import { MenuDetailModal } from '../components/MenuDetailModal';
import { useLanguage } from '../contexts/LanguageContext';
import './Services.css';

const Services = () => {
    const { language, t } = useLanguage();
    const serviceMenuData = getServiceMenuData(language);

    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedMenu, setSelectedMenu] = useState<ServiceMenu | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = [
        { id: 'all', label: t('services.all') },
        { id: 'wedding', label: t('services.wedding') },
        { id: 'corporate', label: t('services.corporate') },
        { id: 'private', label: t('services.private') },
        { id: 'vip', label: t('services.vip') },
    ];

    const filteredServices = activeCategory === 'all'
        ? serviceMenuData
        : serviceMenuData.filter(s => s.category === activeCategory);

    const handleMenuClick = (menu: ServiceMenu) => {
        setSelectedMenu(menu);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMenu(null);
    };

    return (
        <div className="services-page">
            {/* Hero */}
            <section className="services-hero">
                <div className="container">
                    <h1 className="page-title animate-fade-in-up">Our Services</h1>
                    <p className="page-subtitle animate-fade-in-up">
                        모든 특별한 순간에 맞추어진 프리미엄 중식 케이터링 서비스
                    </p>
                </div>
            </section>

            {/* Filter & Grid */}
            <section className="services-content section">
                <div className="container">
                    {/* Category Filter */}
                    <div className="category-filter">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Services Grid */}
                    <div className="services-list">
                        {filteredServices.map((service, index) => (
                            <div
                                key={service.id}
                                className="service-item card clickable"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handleMenuClick(service)}
                            >
                                <div className="service-image">
                                    <img src={service.image} alt={service.title} />
                                    <span className="service-emoji">{service.emoji}</span>
                                    <div className="service-overlay">
                                        <span>상세 메뉴 보기</span>
                                    </div>
                                </div>
                                <div className="service-info">
                                    <span className="service-category">
                                        {categories.find(c => c.id === service.category)?.label}
                                    </span>
                                    <h3 className="service-name">{service.title}</h3>
                                    <p className="service-desc">{service.description}</p>
                                    <ul className="service-features">
                                        {service.features.map((feature, i) => (
                                            <li key={i}>
                                                <span className="check">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="service-footer">
                                        <span className="service-price">{service.price}</span>
                                        <Link
                                            href="/quote"
                                            className="btn btn-primary btn-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            견적 문의
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section section">
                <div className="container">
                    <h2 className="section-title">서비스 진행 과정</h2>
                    <p className="section-subtitle">
                        상담부터 행사 당일까지, 전 과정을 함께합니다.
                    </p>
                    <div className="process-grid">
                        <div className="process-step">
                            <div className="step-number">01</div>
                            <h4>상담 & 견적</h4>
                            <p>행사 일정, 인원, 예산에 맞는 맞춤 상담과 견적을 제공합니다.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">02</div>
                            <h4>메뉴 구성</h4>
                            <p>전문 셰프와 함께 행사 컨셉에 맞는 메뉴를 구성합니다.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">03</div>
                            <h4>시식 & 조율</h4>
                            <p>실제 제공될 메뉴 시식 후 세부 사항을 조율합니다.</p>
                        </div>
                        <div className="process-step">
                            <div className="step-number">04</div>
                            <h4>행사 진행</h4>
                            <p>전문 스태프와 함께 완벽한 케이터링 서비스를 제공합니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="services-cta section">
                <div className="container">
                    <div className="cta-box glass">
                        <h2>맞춤 견적이 필요하신가요?</h2>
                        <p>24시간 AI 상담으로 빠르고 정확한 견적을 받아보세요.</p>
                        <Link href="/quote" className="btn btn-primary btn-lg">
                            무료 견적 받기
                        </Link>
                    </div>
                </div>
            </section>

            {/* Menu Detail Modal */}
            <MenuDetailModal
                menu={selectedMenu}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default Services;

