import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import './Quote.css';

interface QuoteFormData {
    name: string;
    email: string;
    phone: string;
    eventDate: string;
    guestCount: string;
    eventType: string;
    budget: string;
    message: string;
}

const Quote = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<QuoteFormData>({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        guestCount: '',
        eventType: '',
        budget: '',
        message: '',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitMutation = useMutation({
        mutationFn: async (data: QuoteFormData) => {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    guestCount: parseInt(data.guestCount) || 0,
                }),
            });
            if (!response.ok) throw new Error('제출에 실패했습니다.');
            return response.json();
        },
        onSuccess: () => {
            setIsSubmitted(true);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitMutation.mutate(formData);
    };

    const eventTypes = [
        'quote.eventTypes.wedding',
        'quote.eventTypes.seminar',
        'quote.eventTypes.corporate',
        'quote.eventTypes.private',
        'quote.eventTypes.garden',
        'quote.eventTypes.gala',
        'quote.eventTypes.other',
    ];

    const budgetRanges = [
        'quote.budget.range1',
        'quote.budget.range2',
        'quote.budget.range3',
        'quote.budget.range4',
        'quote.budget.range5',
        'quote.budget.unknown',
    ];

    if (isSubmitted) {
        return (
            <div className="quote-page">
                <section className="quote-hero">
                    <div className="container">
                        <h1 className="page-title">{t('quote.title')}</h1>
                    </div>
                </section>
                <section className="quote-success section">
                    <div className="container">
                        <div className="success-card card">
                            <div className="success-icon">✓</div>
                            <h2>{t('quote.successTitle')}</h2>
                            <p>
                                {t('quote.successDesc')}
                            </p>
                            <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>
                                {t('quote.newQuote')}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="quote-page">
            {/* Hero */}
            <section className="quote-hero">
                <div className="container">
                    <h1 className="page-title animate-fade-in-up">{t('quote.title')}</h1>
                    <p className="page-subtitle animate-fade-in-up">
                        {t('quote.subtitle')}
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <section className="quote-form-section section">
                <div className="container">
                    <div className="quote-grid">
                        <div className="quote-info">
                            <h2>{t('quote.infoTitle')}</h2>
                            <p>
                                {t('quote.infoDesc')}
                            </p>

                            <div className="info-cards">
                                <div className="info-card glass">
                                    <span className="info-icon">⏰</span>
                                    <div>
                                        <h4>{t('quote.aiConsult')}</h4>
                                        <p>{t('quote.aiDesc')}</p>
                                    </div>
                                </div>

                                <div className="info-card glass">
                                    <span className="info-icon">📞</span>
                                    <div>
                                        <h4>{t('contact.call')}</h4>
                                        <p>02-1234-5678<br />{t('visit.weekday')} 09:00 - 18:00</p>
                                    </div>
                                </div>

                                <div className="info-card glass">
                                    <span className="info-icon">✉️</span>
                                    <div>
                                        <h4>{t('contact.email')}</h4>
                                        <p>info@outcatering.kr</p>
                                    </div>
                                </div>
                            </div>

                            <div className="quote-features">
                                <h3>{t('quote.whyTitle')}</h3>
                                <ul>
                                    <li>✓ {t('quote.why1')}</li>
                                    <li>✓ {t('quote.why2')}</li>
                                    <li>✓ {t('quote.why3')}</li>
                                    <li>✓ {t('quote.why4')}</li>
                                    <li>✓ {t('quote.why5')}</li>
                                </ul>
                            </div>
                        </div>

                        <form className="quote-form card" onSubmit={handleSubmit}>
                            <h3>{t('quote.formTitle')}</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">{t('quote.name')} *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        placeholder={t('quote.name')}
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="phone">{t('quote.phone')} *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="form-input"
                                        placeholder="010-0000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">{t('quote.email')} *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="eventDate">{t('quote.eventDate')} *</label>
                                    <input
                                        type="date"
                                        id="eventDate"
                                        name="eventDate"
                                        className="form-input"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="guestCount">{t('quote.guestCount')} *</label>
                                    <input
                                        type="number"
                                        id="guestCount"
                                        name="guestCount"
                                        className="form-input"
                                        placeholder="50"
                                        min="1"
                                        value={formData.guestCount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="eventType">{t('quote.eventType')} *</label>
                                    <select
                                        id="eventType"
                                        name="eventType"
                                        className="form-input form-select"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">{t('quote.select')}</option>
                                        {eventTypes.map(key => (
                                            <option key={key} value={t(key)}>{t(key)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="budget">{t('quote.budget')}</label>
                                    <select
                                        id="budget"
                                        name="budget"
                                        className="form-input form-select"
                                        value={formData.budget}
                                        onChange={handleChange}
                                    >
                                        <option value="">{t('quote.select')}</option>
                                        {budgetRanges.map(key => (
                                            <option key={key} value={t(key)}>{t(key)}</option>
                                        ))}
                                    </select>

                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="message">{t('contact.message')}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-input form-textarea"
                                    placeholder={t('contact.message')}
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg submit-btn"
                                disabled={submitMutation.isPending}
                            >
                                {submitMutation.isPending ? t('contact.sending') : t('quote.submit')}
                            </button>

                            {submitMutation.isError && (
                                <p className="error-message">
                                    {t('common.error')}
                                </p>
                            )}

                            <p className="form-note">
                                {t('quote.note')}
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Quote;
