import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            <div className="footer-content container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <span className="logo-text">{t('footer.restaurant_name')}</span>
                        </Link>
                        <p className="footer-desc">
                            {t('heritage.copy').split('. ')[0]}.
                        </p>
                        <div className="footer-social">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                                Follow us on Instagram
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/services">{t('nav.menu')}</Link></li>
                            <li><Link to="/quote">{t('nav.catering')}</Link></li>
                            <li><Link to="/contact">{t('nav.contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section">
                        <h4 className="footer-title">Contact Information</h4>
                        <ul className="footer-contact">
                            <li>
                                <span className="contact-label">Address:</span>
                                <span>{t('footer.address_detail')}</span>
                            </li>
                            <li>
                                <span className="contact-label">Delivery:</span>
                                <a href="tel:09064237523">{t('footer.phone_delivery')}</a>
                            </li>
                            <li>
                                <span className="contact-label">G-Cash:</span>
                                <a href="tel:09151740251">{t('footer.phone_gcash')}</a>
                            </li>
                            <li>
                                <span className="contact-label">Official Hours:</span>
                                <span>{t('footer.hours_official')}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Map Link */}
                    <div className="footer-section">
                        <h4 className="footer-title">Location</h4>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                        >
                            Open in Google Maps
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright">
                        {t('footer.copy')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
