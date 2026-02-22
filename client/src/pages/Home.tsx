import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';

const Home = () => {
    const { t } = useLanguage();

    const dishes = [
        { key: 'sets', image: 'https://images.unsplash.com/photo-1541696490-8744a5db7f34?auto=format&fit=crop&w=1200&q=80' }, /* Sets A-E */
        { key: 'tangsuyuk', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80' }, /* 5 Styles */
        { key: 'specials', image: 'https://images.unsplash.com/photo-1590671886400-8f8088b90703?auto=format&fit=crop&w=1200&q=80' }, /* Jokbal */
    ];

    const cateringPackages = [
        { key: 'intimate', pax: '4–6 guests' },
        { key: 'celebration', pax: '10–12 guests', popular: true },
        { key: 'corporate', pax: '15–25 pax', badge: true },
    ];

    return (
        <div className="home-page">
            {/* SECTION 1 — HERO */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-container">
                    <div className="hero-content animate-fade-in-up">
                        <span className="hero-status-badge">{t('hero.badge')}</span>
                        <h1 className="hero-headline">{t('hero.headline')}</h1>
                        <p className="hero-subheadline">{t('hero.subheadline')}</p>
                        <div className="hero-actions">
                            <a href="tel:09064237523" className="btn btn-primary btn-delivery">{t('hero.cta.delivery')}</a>
                            <Link to="/contact" className="btn btn-gold-outline">{t('hero.cta.reserve')}</Link>
                        </div>
                        <p className="hero-trust">{t('hero.trust')}</p>
                    </div>
                </div>
            </section>

            {/* SECTION 2 — COMPETITIVE ADVANTAGE BAR */}
            <section className="advantage-bar-section diamond-overlay">
                <div className="container strip-grid">
                    <div className="strip-item">
                        <p>{t('trust.delivery')}</p>
                    </div>
                    <div className="strip-item">
                        <p>{t('trust.location')}</p>
                    </div>
                    <div className="strip-item">
                        <p>{t('trust.payment')}</p>
                    </div>
                </div>
            </section>

            {/* SECTION 3 — SIGNATURE DISHES */}
            <section className="signature-section section">
                <div className="container">
                    <div className="section-header text-center mb-16">
                        <h2 className="section-title mb-4">{t('signature.title')}</h2>
                        <p className="section-intro">{t('signature.intro')}</p>
                    </div>
                    <div className="dish-grid">
                        {dishes.map((dish) => (
                            <div key={dish.key} className="dish-card">
                                <div className="dish-image-wrapper">
                                    <img src={dish.image} alt={t(`signature.${dish.key}`)} />
                                </div>
                                <div className="dish-content">
                                    <h3>{t(`signature.${dish.key}`)}</h3>
                                    <p>{t(`signature.${dish.key}_desc`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/services" className="btn btn-gold-outline">{t('signature.more')}</Link>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — CATERING AUTHORITY */}
            <section className="catering-authority-section section bg-matte">
                <div className="container">
                    <div className="catering-header mb-16">
                        <h2 className="section-title mb-6">{t('catering.authority.title')}</h2>
                        <p className="section-desc max-w-2xl">{t('catering.authority.desc')}</p>
                    </div>
                    <div className="package-grid">
                        {cateringPackages.map((pkg) => (
                            <div key={pkg.key} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                                {pkg.badge && <span className="package-badge">{t('catering.corporate.badge')}</span>}
                                <h3>{t(`catering.package.${pkg.key}.title`)}</h3>
                                <p className="pax-count">{pkg.pax}</p>
                                <p className="package-desc">{t(`catering.package.${pkg.key}.desc`)}</p>
                                <Link to="/quote" className="btn btn-primary w-full mt-auto">
                                    {t('catering.proposal')}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <p className="catering-trust-line text-center mt-12">{t('catering.trust')}</p>
                </div>
            </section>

            {/* SECTION 5 — RESTAURANT EXPERIENCE */}
            <section className="restaurant-experience-section section">
                <div className="container">
                    <div className="experience-grid">
                        <div className="experience-content">
                            <h2 className="section-title text-left mb-6">{t('visit.headline')}</h2>
                            <p className="experience-copy mb-8">{t('visit.copy')}</p>
                            <ul className="highlight-list mb-12">
                                <li>{t('visit.highlight1')}</li>
                                <li>{t('visit.highlight2')}</li>
                                <li>{t('visit.highlight3')}</li>
                                <li>{t('visit.highlight4')}</li>
                            </ul>
                            <div className="experience-actions">
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('visit.directions')}</a>
                                <Link to="/contact" className="btn btn-outline">{t('visit.reserve')}</Link>
                            </div>
                        </div>
                        <div className="experience-image">
                            <img src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80" alt="Shandong Restaurant Interior" className="rounded-depth" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- EXPERIENCE TAGLINE STRIP --- */}
            <section className="experience-tagline-section section diamond-overlay">
                <div className="container text-center">
                    <h2 className="tagline-text animate-fade-in-up">
                        "FOOD is not just eating energy.<br />It's an <span className="text-gold">EXPERIENCE</span>."
                    </h2>
                </div>
            </section>

            {/* SECTION 6 — HERITAGE STORY */}
            <section className="heritage-story-section section bg-primary-dark">
                <div className="container text-center">
                    <div className="story-content max-w-3xl mx-auto">
                        <h2 className="section-title mb-8">{t('heritage.title')}</h2>
                        <div className="story-text">
                            <p>{t('heritage.copy')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7 — SOCIAL PROOF */}
            <section className="social-proof-section section">
                <div className="container">
                    <h2 className="section-title text-center mb-16">{t('social.title')}</h2>
                    <div className="testimonial-grid">
                        <div className="testimonial-card">
                            <div className="review-stars">★★★★★</div>
                            <p className="review-text">"{t('social.review1.text')}"</p>
                            <p className="review-author">{t('social.review1.author')} <span className="source-tag">via Google Reviews</span></p>
                        </div>
                        <div className="testimonial-card">
                            <div className="review-stars">★★★★★</div>
                            <p className="review-text">"{t('social.review2.text')}"</p>
                            <p className="review-author">{t('social.review2.author')} <span className="source-tag">via Google Reviews</span></p>
                        </div>
                    </div>
                    <div className="google-rating mt-12 text-center">
                        <span className="rating-stars">★★★★★</span>
                        <span className="rating-text">Google Rated 4.8</span>
                    </div>
                </div>
            </section>

            {/* SECTION 8 — FINAL CTA */}
            <section className="final-cta-section section">
                <div className="container">
                    <div className="cta-box glass text-center">
                        <h2 className="section-title mb-6">{t('final.cta.headline')}</h2>
                        <p className="final-copy mb-12">{t('final.cta.copy')}</p>
                        <div className="cta-actions">
                            <a href="tel:09064237523" className="btn btn-primary btn-delivery">{t('hero.cta.delivery')}</a>
                            <Link to="/contact" className="btn btn-gold-outline">{t('hero.cta.reserve')}</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
