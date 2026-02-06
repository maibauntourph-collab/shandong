import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { LanguageSelector } from '../LanguageSelector';
import ExchangeRateDisplay from '../ExchangeRateDisplay/ExchangeRateDisplay';
import { useLanguage } from '../../contexts/LanguageContext';
import './Navigation.css';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [location] = useLocation();
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { href: '/', label: t('nav.home') },
        { href: '/services', label: t('nav.services') },
        { href: '/quote', label: t('nav.quote') },
        { href: '/contact', label: t('nav.contact') },
    ];

    return (
        <header className={`nav-header ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="nav-container container">
                <Link href="/" className="nav-logo">
                    <span className="logo-text">山東</span>
                    <span className="logo-accent">CATERING</span>
                </Link>

                <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`nav-link ${location === link.href ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-cta">
                        <Link href="/quote" className="btn btn-primary btn-sm">
                            {t('hero.cta1')}
                        </Link>
                    </li>
                </ul>

                <div className="nav-actions">
                    <ExchangeRateDisplay />
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
    );
};

export default Navigation;
