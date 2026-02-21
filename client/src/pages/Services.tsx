import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        { id: 'packages', label: t('services.packages') },
        { id: 'corporate', label: t('services.corporate') },
        { id: 'signature', label: t('services.signature') },
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
                <div className="hero-overlay"></div>
                <div className="container relative z-10">
                    <h1 className="page-title animate-fade-in-up mb-4">{t('services.title')}</h1>
                    <p className="page-subtitle animate-fade-in-up text-lg max-w-2xl mx-auto">
                        {t('services.subtitle')}
                    </p>
                </div>
            </section>

            {/* Filter & Grid */}
            <section className="services-content section">
                <div className="container">
                    <div className="category-filter-premium mb-16">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn-premium ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="services-grid-premium">
                        {filteredServices.map((service, index) => (
                            <div
                                key={service.id}
                                className="service-card-premium glass clickable"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handleMenuClick(service)}
                            >
                                <div className="service-image-header">
                                    <img src={service.image} alt={service.title} />
                                    <div className="service-badge">{service.emoji}</div>
                                    <div className="image-overlay-premium">
                                        <span>{t('services.viewDetail')}</span>
                                    </div>
                                </div>
                                <div className="service-body-premium">
                                    <div className="service-meta">
                                        <span className="category-tag">{service.subtitle}</span>
                                        <span className="price-tag">{service.price}</span>
                                    </div>
                                    <h3 className="service-title-premium">{service.title}</h3>
                                    <p className="service-desc-premium">{service.description}</p>

                                    <ul className="service-features-premium">
                                        {service.features.map((feature, i) => (
                                            <li key={i}>
                                                <span className="gold-dot">•</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="service-actions-premium">
                                        <Link
                                            to="/quote"
                                            className="btn btn-primary btn-sm w-full"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t('services.getQuote')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section-premium section bg-matte">
                <div className="container">
                    <div className="section-header-centered mb-20 text-center">
                        <h2 className="section-title mb-4">{t('services.process.title')}</h2>
                        <p className="section-subtitle max-w-xl mx-auto opacity-70">
                            {t('services.process.subtitle')}
                        </p>
                    </div>

                    <div className="process-flow-premium">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="process-item-premium">
                                <div className="step-number-ring">
                                    <span>0{step}</span>
                                </div>
                                <div className="process-text">
                                    <h4>{t(`services.process.step${step}.title`)}</h4>
                                    <p>{t(`services.process.step${step}.desc`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="services-final-cta section">
                <div className="container">
                    <div className="cta-banner-premium glass">
                        <div className="cta-content-premium">
                            <h2>{t('services.cta.title')}</h2>
                            <p>{t('services.cta.subtitle')}</p>
                            <Link to="/quote" className="btn btn-gold btn-lg mt-8">
                                {t('catering.proposal')}
                            </Link>
                        </div>
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
