import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLanguage } from '../contexts/LanguageContext';
import './Quote.css';

interface QuoteFormData {
    eventType: string;
    eventDate: string;
    eventLocation: string;
    guestCount: string;
    cuisine: string;
    budget: string;
    name: string;
    phone: string;
    facebookName: string;
    message: string;
}

const Quote = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<QuoteFormData>({
        eventType: '',
        eventDate: '',
        eventLocation: '',
        guestCount: '',
        cuisine: '',
        budget: '',
        name: '',
        phone: '',
        facebookName: '',
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
            if (!response.ok) throw new Error('Failed to submit.');
            return response.json();
        },
        onSuccess: () => {
            setIsSubmitted(true);
            window.scrollTo(0, 0);
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

    const eventTypes = ['family', 'birthday', 'wedding', 'corporate', 'church', 'other'];
    const locations = ['cebu', 'mandaue', 'lapulapu', 'other'];
    const cuisines = ['korean', 'chinese', 'both'];
    const budgetRanges = ['range1', 'range2', 'range3'];

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
                        <div className="success-card card glass text-center max-w-2xl mx-auto">
                            <div className="success-icon mb-6">✓</div>
                            <h2 className="mb-4">{t('quote.successTitle')}</h2>
                            <p className="mb-8">{t('quote.successDesc')}</p>
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
            <section className="quote-hero">
                <div className="hero-overlay"></div>
                <div className="container relative z-10">
                    <h1 className="page-title animate-fade-in-up mb-4">{t('quote.title')}</h1>
                    <p className="page-subtitle animate-fade-in-up text-lg max-w-2xl">{t('quote.subtitle')}</p>
                </div>
            </section>

            <section className="quote-form-section section">
                <div className="container">
                    <form className="quote-form glass p-12 max-w-3xl mx-auto" onSubmit={handleSubmit}>
                        <h2 className="section-title text-left mb-12">{t('quote.formTitle')}</h2>

                        {/* Step 1: Event Basics */}
                        <div className="form-step mb-12">
                            <h3 className="step-title-premium mb-6">01. Event Details</h3>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t('quote.eventType')} *</label>
                                    <select
                                        name="eventType"
                                        className="form-input-premium"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">{t('quote.select')}</option>
                                        {eventTypes.map(type => (
                                            <option key={type} value={type}>{t(`quote.eventTypes.${type}`)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('quote.eventDate')} *</label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        className="form-input-premium"
                                        value={formData.eventDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group mt-6">
                                <label className="form-label">{t('quote.eventLocation')} *</label>
                                <select
                                    name="eventLocation"
                                    className="form-input-premium"
                                    value={formData.eventLocation}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">{t('quote.select')}</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{t(`quote.locations.${loc}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Step 2: Requirements */}
                        <div className="form-step mb-12">
                            <h3 className="step-title-premium mb-6">02. Requirements</h3>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t('quote.guestCount')} *</label>
                                    <input
                                        type="number"
                                        name="guestCount"
                                        className="form-input-premium"
                                        placeholder="e.g. 50"
                                        value={formData.guestCount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('quote.cuisine')} *</label>
                                    <select
                                        name="cuisine"
                                        className="form-input-premium"
                                        value={formData.cuisine}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">{t('quote.select')}</option>
                                        {cuisines.map(c => (
                                            <option key={c} value={c}>{t(`quote.cuisines.${c}`)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group mt-6">
                                <label className="form-label">{t('quote.budget')} *</label>
                                <select
                                    name="budget"
                                    className="form-input-premium"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">{t('quote.select')}</option>
                                    {budgetRanges.map(range => (
                                        <option key={range} value={range}>{t(`quote.budget.${range}`)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Step 3: Contact */}
                        <div className="form-step mb-12">
                            <h3 className="step-title-premium mb-6">03. Contact Information</h3>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t('quote.name')} *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input-premium"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t('quote.phone')} *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input-premium"
                                        placeholder="09XX-XXX-XXXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group mt-6">
                                <label className="form-label">{t('quote.facebookName')}</label>
                                <input
                                    type="text"
                                    name="facebookName"
                                    className="form-input-premium"
                                    placeholder="Optional: For Messenger contact"
                                    value={formData.facebookName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group mt-6">
                                <label className="form-label">{t('quote.message')}</label>
                                <textarea
                                    name="message"
                                    className="form-input-premium form-textarea"
                                    style={{ minHeight: '150px' }}
                                    placeholder="Tell us about special requests, allergens, or venue details..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={submitMutation.isPending}
                        >
                            {submitMutation.isPending ? 'Processing...' : t('quote.submit')}
                        </button>

                        {submitMutation.isError && (
                            <p className="error-message text-center mt-6" style={{ color: '#ff6b6b' }}>
                                Submission failed. Please try again or call us directly.
                            </p>
                        )}
                        <p className="text-muted text-center mt-8 text-sm">
                            {t('quote.note')}
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Quote;
