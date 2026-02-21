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
            if (!response.ok) throw new Error('Failed to send.');
            return response.json();
        },
        onSuccess: () => {
            setIsSubmitted(true);
            window.scrollTo(0, 0);
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
            <section className="contact-hero">
                <div className="hero-overlay"></div>
                <div className="container relative z-10">
                    <h1 className="page-title animate-fade-in-up">{t('contact.title')}</h1>
                    <p className="page-subtitle animate-fade-in-up max-w-2xl">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </section>

            {/* Contact Info */}
            <section className="contact-info-section section">
                <div className="container">
                    <div className="contact-cards-premium">
                        <div className="contact-card-premium glass">
                            <span className="contact-icon">📍</span>
                            <h3>{t('contact.visit')}</h3>
                            <p>
                                AS Fortuna Street,<br />
                                Mandaue City, Cebu
                            </p>
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="premium-link"
                            >
                                {t('visit.directions')}
                            </a>
                        </div>

                        <div className="contact-card-premium glass">
                            <span className="contact-icon">📞</span>
                            <h3>{t('contact.call')}</h3>
                            <p>
                                0915 174 0251<br />
                                0906 423 7523
                            </p>
                            <a href="tel:09151740251" className="premium-link">
                                {t('hero.cta.reserve')}
                            </a>
                        </div>

                        <div className="contact-card-premium glass">
                            <span className="contact-icon">✉️</span>
                            <h3>{t('contact.email')}</h3>
                            <p>
                                shandongcebu@gmail.com<br />
                                info@shandong.com
                            </p>
                            <a href="mailto:shandongcebu@gmail.com" className="premium-link">
                                Send Email
                            </a>
                        </div>

                        <div className="contact-card-premium glass">
                            <span className="contact-icon">💬</span>
                            <h3>{t('contact.kakao')}</h3>
                            <p>
                                ID: ShandongCebu<br />
                                {t('contact.kakaoDesc')}
                            </p>
                            <a href="#" className="premium-link">
                                Open Chat
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map & Form */}
            <section className="contact-form-section section">
                <div className="container">
                    <div className="contact-grid-premium">
                        {/* Map Holder */}
                        <div className="map-wrapper-premium">
                            <div className="map-visual-premium">
                                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80" alt="Cebu Map Location" />
                                <div className="map-labels">
                                    <h4>{t('footer.restaurant_name')}</h4>
                                    <p>AS Fortuna, Mandaue</p>
                                </div>
                            </div>
                            <div className="business-hours-premium glass">
                                <h4>{t('footer.hours')}</h4>
                                <ul>
                                    <li>
                                        <span>Mon - Sun</span>
                                        <span>11:00 AM – 5:00 AM</span>
                                    </li>
                                </ul>
                                <p className="note">* Open late night for the Cebu BPO & nightlife community</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-wrapper-premium">
                            {isSubmitted ? (
                                <div className="success-message glass p-12 text-center">
                                    <div className="success-emoji mb-6">✨</div>
                                    <h3>{t('contact.successTitle')}</h3>
                                    <p className="mb-8">{t('contact.successDesc')}</p>
                                    <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>
                                        {t('contact.newMessage')}
                                    </button>
                                </div>
                            ) : (
                                <form className="contact-form-premium glass" onSubmit={handleSubmit}>
                                    <h2 className="mb-8">{t('contact.formTitle')}</h2>

                                    <div className="form-group-premium">
                                        <label className="form-label">{t('contact.name')} *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input-premium"
                                            placeholder="Your Name"
                                            value={contactForm.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-premium">
                                        <label className="form-label">{t('contact.email')} *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input-premium"
                                            placeholder="example@email.com"
                                            value={contactForm.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-premium">
                                        <label className="form-label">{t('contact.subject')} *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-input-premium"
                                            placeholder="Purpose of inquiry"
                                            value={contactForm.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-premium">
                                        <label className="form-label">{t('contact.message')} *</label>
                                        <textarea
                                            name="message"
                                            className="form-input-premium"
                                            style={{ minHeight: '150px' }}
                                            placeholder="How can we help you?"
                                            value={contactForm.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-full mt-4"
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
            <section className="faq-section section bg-matte">
                <div className="container">
                    <h2 className="section-title text-center mb-16">{t('contact.faqTitle')}</h2>
                    <div className="faq-grid-premium">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="faq-card-premium glass">
                                <h4>{t(`contact.faq${i}Q`)}</h4>
                                <p>{t(`contact.faq${i}A`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
