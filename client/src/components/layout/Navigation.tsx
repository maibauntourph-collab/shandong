import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSelector } from '../LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import './Navigation.css';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { href: '/', label: t('nav.home') },
        { href: '/services', label: t('nav.menu') },
        { href: '/quote', label: t('nav.catering') },
        { href: '/contact', label: t('nav.contact') },
    ];

    return (
        <>
            <header className={`nav-header ${isScrolled ? 'scrolled' : ''}`}>
                <nav className="nav-container container">
                    <Link to="/" className="nav-logo-premium">
                        <div className="logo-brush-container">
                            <span className="logo-hanja-brush">山東</span>
                            <div className="logo-text-stack">
                                <span className="logo-brand-main">SHAN<span className="text-red">DONG</span></span>
                                <span className="logo-brand-sub">KOREAN & CHINESE RESTAURANT</span>
                            </div>
                        </div>
                    </Link>

                    <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        {navLinks.map((link, index) => (
                            <li key={`${link.href}-${index}`}>
                                <Link
                                    to={link.href}
                                    className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className="nav-cta">
                            <a href="tel:09064237523" className="btn btn-primary">
                                {t('hero.cta.delivery')}
                            </a>
                        </li>
                    </ul>

                    <div className="nav-actions">
                        <LanguageSelector />
                        <button
                            className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation Strip */}
            <div className="mobile-bottom-nav">
                <div className="mobile-bottom-grid">
                    <a href="tel:09064237523" className="mobile-nav-item call">
                        <span>📞</span> {t('hero.cta.delivery')}
                    </a>
                    <Link to="/contact" className="mobile-nav-item quote">
                        <span>📅</span> {t('hero.cta.reserve')}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navigation;
