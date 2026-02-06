import { useLocation, Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { getServiceMenuData } from '../data/menuData';
import './Home.css';

const Home = () => {
    const { t, language } = useLanguage();
    const [, setLocation] = useLocation();
    const navigate = (path: string) => setLocation(path);
    const restaurantMenu = getServiceMenuData(language).filter(item =>
        !['wedding', 'corporate', 'private', 'vip'].includes(item.category)
    );

    const services = [
        {
            icon: '🥢',
            title: t('services.wedding'),
            description: t('services.subtitle'),
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80',
            link: '/quote'
        },
        {
            icon: '🏢',
            title: t('services.corporate'),
            description: t('services.subtitle'),
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
            link: '/quote'
        },
        {
            icon: '🎊',
            title: t('services.private'),
            description: t('services.subtitle'),
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
            link: '/quote'
        },
        {
            icon: '✨',
            title: t('services.vip'),
            description: t('services.subtitle'),
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
            link: '/quote'
        },
    ];

    const testimonials = [
        {
            quote: '산동 레스토랑의 출장 연회 서비스 덕분에 결혼식이 더욱 특별했습니다.',
            author: '김서연',
            role: '웨딩 고객',
        },
        {
            quote: '회사 송년회 케이터링을 맡겼는데, 직원들 모두 감탄했습니다.',
            author: '박준혁',
            role: '기업 고객',
        },
        {
            quote: '부모님 회갑연을 최고로 만들어주셔서 감사합니다.',
            author: '이은지',
            role: '가족 행사 고객',
        },
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="hero-content container">
                    <div className="hero-text animate-fade-in-up">
                        <span className="hero-badge">{t('hero.badge')}</span>
                        <h1 className="hero-title">
                            {t('hero.title1')}<br />
                            <span className="text-gold">{t('hero.title2')}</span>
                        </h1>
                        <p className="hero-description">
                            {t('hero.description')}
                        </p>
                        <p className="hero-tagline" style={{ fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.9, marginTop: '0.5rem' }}>
                            "{t('tagline.main')}"
                        </p>
                        <div className="hero-buttons">
                            <Link href="/quote" className="btn btn-primary btn-lg">
                                {t('hero.cta1')}
                            </Link>
                            <Link href="/services" className="btn btn-outline btn-lg">
                                {t('hero.cta2')}
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual animate-fade-in">
                        <div className="hero-image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
                                alt="정통 중식 코스요리"
                                className="hero-image"
                            />
                            <div className="hero-image-overlay"></div>
                        </div>
                        <div className="hero-stats glass">
                            <div className="stat">
                                <span className="stat-number">1,500+</span>
                                <span className="stat-label">{t('hero.stats.events')}</span>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">{t('hero.stats.satisfaction')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-scroll">
                    <span>스크롤</span>
                    <div className="scroll-indicator"></div>
                </div>
            </section>

            {/* Services Section (Package Menu) */}
            <section className="services-section section">
                <div className="container">
                    <h2 className="section-title">{t('services.title')}</h2>
                    <p className="section-subtitle">
                        {t('services.description')}
                    </p>
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="service-card card-glass"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => navigate('/services')}
                            >
                                <div className="service-image-wrapper">
                                    <img src={service.image} alt={service.title} className="service-image" />
                                </div>
                                <div className="service-content">
                                    <span className="service-icon">{service.icon}</span>
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>
                                    <div className="service-link">
                                        {t('common.learnMore')} →
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Restaurant Menu Section */}
            <section className="restaurant-menu-section section bg-light">
                <div className="container">
                    <h2 className="section-title">🍜 {t('visit.title')}</h2>
                    <p className="section-subtitle">
                        {t('visit.description')}
                    </p>
                    <div className="restaurant-menu-grid">
                        {restaurantMenu.map((menu, index) => (
                            <div key={menu.id} className="menu-category-card card" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="menu-category-image">
                                    <img src={menu.image} alt={menu.title} />
                                    <span className="menu-category-emoji glass">{menu.emoji}</span>
                                </div>
                                <div className="menu-category-content">
                                    <h3>{menu.title}</h3>
                                    <p className="menu-category-desc">{menu.description}</p>
                                    <div className="menu-category-features">
                                        {menu.features.slice(0, 4).map((feature, i) => (
                                            <span key={i} className="feature-tag">✓ {feature}</span>
                                        ))}
                                    </div>
                                    <div className="menu-category-footer">
                                        <span className="price-tag">{menu.price}</span>
                                        <button className="btn btn-outline btn-sm" onClick={() => navigate('/services')}>
                                            {t('hero.cta1')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-content">
                            <span className="about-badge">{t('about.badge')}</span>
                            <h2 className="about-title">
                                {t('about.title')}
                            </h2>
                            <p className="about-text">
                                {t('about.description')}
                            </p>
                            <ul className="about-features">
                                <li>
                                    <span className="feature-check">✓</span>
                                    {t('about.feature1')}
                                </li>
                                <li>
                                    <span className="feature-check">✓</span>
                                    {t('about.feature2')}
                                </li>
                                <li>
                                    <span className="feature-check">✓</span>
                                    {t('about.feature3')}
                                </li>
                                <li>
                                    <span className="feature-check">✓</span>
                                    {t('about.feature4')}
                                </li>
                            </ul>
                            <Link href="/quote" className="btn btn-primary">
                                {t('services.inquire')}
                            </Link>
                        </div>
                        <div className="about-visual">
                            <div className="about-image-wrapper">
                                <img
                                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=80"
                                    alt="산동 레스토랑 셰프"
                                    className="about-image"
                                />
                            </div>
                            <div className="about-accent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visit Us - Restaurant Section */}
            <section className="visit-section section">
                <div className="container">
                    <h2 className="section-title">🍜 {t('visit.title')}</h2>
                    <p className="section-subtitle">
                        {t('visit.description')}
                    </p>

                    <div className="visit-grid">
                        {/* Restaurant Images */}
                        <div className="visit-gallery">
                            <div className="gallery-main">
                                <img
                                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                                    alt="Restaurant Interior"
                                />
                            </div>
                            <div className="gallery-grid">
                                <img
                                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
                                    alt="Chinese Dish"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
                                    alt="Ambiance"
                                />
                            </div>
                        </div>

                        {/* Restaurant Info */}
                        <div className="visit-info">
                            <div className="info-card glass">
                                <h3>{t('visit.hours')}</h3>
                                <div className="info-list">
                                    <div className="info-row">
                                        <span>{t('visit.weekday')}</span>
                                        <strong>11:00 - 22:00</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>{t('visit.weekend')}</span>
                                        <strong>11:00 - 21:30</strong>
                                    </div>
                                    <div className="info-row highlight">
                                        <span>{t('visit.breaktime')}</span>
                                        <strong>15:00 - 17:00</strong>
                                    </div>
                                    <div className="info-row">
                                        <span>{t('visit.lastorder')}</span>
                                        <strong>{t('visit.lastorder')} 30min prior</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card glass">
                                <h3>📍 {t('visit.location')}</h3>
                                <p className="address">328 10th Street, #101, Oakland, CA 94607</p>
                                <p className="transport">🚇 {t('visit.transport')}</p>
                                <p className="parking">🅿️ {t('visit.parking')}</p>
                            </div>

                            <div className="info-card glass">
                                <h3>📞 {t('visit.reservation')}</h3>
                                <a href="tel:510-839-2299" className="phone-number">(510) 839-2299</a>
                                <p className="reservation-note">{t('visit.group')}</p>
                            </div>

                            <div className="info-card glass menu-preview">
                                <h3>🥢 {t('visit.menu_preview')}</h3>
                                <div className="menu-list">
                                    <div className="menu-item">
                                        <span className="menu-name">Shan Dong Chicken</span>
                                        <span className="menu-price">$16.95</span>
                                    </div>
                                    <div className="menu-item">
                                        <span className="menu-name">Sesame Noodles</span>
                                        <span className="menu-price">$14.95</span>
                                    </div>
                                </div>
                                <Link href="/services" className="view-all-menu">
                                    {t('common.learnMore')} →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section section">
                <div className="container">
                    <h2 className="section-title">{t('testimonials.title')}</h2>
                    <p className="section-subtitle">
                        {t('testimonials.subtitle')}
                    </p>
                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card card">
                                <div className="testimonial-quote">
                                    <span className="quote-mark">"</span>
                                    <p>{testimonial.quote}</p>
                                </div>
                                <div className="testimonial-author">
                                    <div className="author-avatar">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div className="author-info">
                                        <span className="author-name">{testimonial.author}</span>
                                        <span className="author-role">{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section section">
                <div className="container">
                    <div className="cta-content glass">
                        <h2 className="cta-title">
                            {t('cta.title')}
                        </h2>
                        <p className="cta-text">
                            {t('cta.description')}
                        </p>
                        <div className="cta-buttons">
                            <Link href="/quote" className="btn btn-primary btn-lg">
                                {t('cta.button')}
                            </Link>
                            <a href="tel:510-839-2299" className="btn btn-secondary btn-lg">
                                📞 {t('contact.phone')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
