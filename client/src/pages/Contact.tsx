import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import './Contact.css';

const Contact = () => {
    const { t } = useLanguage();
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitMutation = useMutation({
        mutationFn: async (data: typeof contactForm) => {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('전송에 실패했습니다.');
            return response.json();
        },
        onSuccess: () => {
            setIsSubmitted(true);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContactForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitMutation.mutate(contactForm);
    };

    return (
        <div className="contact-page">
            {/* Hero */}
            {/* Hero */}
            <section className="contact-hero">
                <div className="container">
                    <h1 className="page-title animate-fade-in-up">{t('contact.title')}</h1>
                    <p className="page-subtitle animate-fade-in-up">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="contact-info-section section">
                <div className="container">
                    <div className="contact-cards">
                        <div className="contact-card card">
                            <span className="contact-icon">📍</span>
                            <h3>{t('contact.visit')}</h3>
                            <p>
                                서울특별시 강남구<br />
                                테헤란로 123, 5층
                            </p>
                            <a
                                href="https://map.naver.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card-link"
                            >
                                {t('contact.mapView')}
                            </a>
                        </div>

                        <div className="contact-card card">
                            <span className="contact-icon">📞</span>
                            <h3>{t('contact.call')}</h3>
                            <p>
                                02-1234-5678<br />
                                {t('visit.weekday')} 09:00 - 18:00
                            </p>
                            <a href="tel:02-1234-5678" className="card-link">
                                {t('contact.callAction')}
                            </a>
                        </div>

                        <div className="contact-card card">
                            <span className="contact-icon">✉️</span>
                            <h3>{t('contact.email')}</h3>
                            <p>
                                info@outcatering.kr<br />
                                24시간 이내 답변
                            </p>
                            <a href="mailto:info@outcatering.kr" className="card-link">
                                {t('contact.emailAction')}
                            </a>
                        </div>

                        <div className="contact-card card">
                            <span className="contact-icon">💬</span>
                            <h3>{t('contact.kakao')}</h3>
                            <p>
                                @산동레스토랑<br />
                                {t('contact.kakaoDesc')}
                            </p>
                            <a href="#" className="card-link">
                                {t('contact.kakaoAction')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map & Form */}
            {/* Map & Form */}
            <section className="contact-form-section section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Map Placeholder */}
                        <div className="map-container">
                            <div className="map-placeholder">
                                <span className="map-icon">🗺️</span>
                                <p>{t('contact.mapPlaceholder')}</p>
                                <a
                                    href="https://map.naver.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                >
                                    {t('contact.viewNaver')}
                                </a>
                            </div>
                            <div className="business-hours card">
                                <h4>{t('contact.businessHours')}</h4>
                                <ul>
                                    <li>
                                        <span>{t('contact.monFri')}</span>
                                        <span>09:00 - 18:00</span>
                                    </li>
                                    <li>
                                        <span>{t('contact.sat')}</span>
                                        <span>10:00 - 15:00</span>
                                    </li>
                                    <li>
                                        <span>{t('contact.sunHol')}</span>
                                        <span>{t('contact.closed')}</span>
                                    </li>
                                </ul>
                                <p className="note">* {t('contact.alwaysOpen')}</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper">
                            {isSubmitted ? (
                                <div className="success-message card">
                                    <div className="success-icon">✓</div>
                                    <h3>{t('contact.successTitle')}</h3>
                                    <p>{t('contact.successDesc')}</p>
                                    <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>
                                        {t('contact.newMessage')}
                                    </button>
                                </div>
                            ) : (
                                <form className="contact-form card" onSubmit={handleSubmit}>
                                    <h3>{t('contact.formTitle')}</h3>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="contact-name">{t('contact.name')} *</label>
                                        <input
                                            type="text"
                                            id="contact-name"
                                            name="name"
                                            className="form-input"
                                            placeholder={t('contact.name')}
                                            value={contactForm.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="contact-email">{t('contact.email')} *</label>
                                        <input
                                            type="email"
                                            id="contact-email"
                                            name="email"
                                            className="form-input"
                                            placeholder="example@email.com"
                                            value={contactForm.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="contact-subject">{t('contact.subject')} *</label>
                                        <input
                                            type="text"
                                            id="contact-subject"
                                            name="subject"
                                            className="form-input"
                                            placeholder={t('contact.subject')}
                                            value={contactForm.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="contact-message">{t('contact.message')} *</label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            className="form-input form-textarea"
                                            placeholder={t('contact.message')}
                                            value={contactForm.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg submit-btn"
                                        disabled={submitMutation.isPending}
                                    >
                                        {submitMutation.isPending ? t('contact.sending') : t('contact.send')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section section">
                <div className="container">
                    <h2 className="section-title">{t('contact.faqTitle')}</h2>
                    <div className="faq-list">
                        <div className="faq-item card">
                            <h4>{t('contact.faq1Q')}</h4>
                            <p>
                                {t('contact.faq1A')}
                            </p>
                        </div>
                        <div className="faq-item card">
                            <h4>{t('contact.faq2Q')}</h4>
                            <p>
                                {t('contact.faq2A')}
                            </p>
                        </div>
                        <div className="faq-item card">
                            <h4>{t('contact.faq3Q')}</h4>
                            <p>
                                {t('contact.faq3A')}
                            </p>
                        </div>
                        <div className="faq-item card">
                            <h4>{t('contact.faq4Q')}</h4>
                            <p>
                                {t('contact.faq4A')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
