import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './ExchangeRateDisplay.css';

interface ExchangeRates {
    PHP: { KRW: number; USD: number };
    KRW: { PHP: number; USD: number };
    USD: { PHP: number; KRW: number };
}

interface ExchangeRateData {
    rates: ExchangeRates;
    lastUpdated: string;
}

const ExchangeRateDisplay = () => {
    const { t } = useLanguage();
    const [rates, setRates] = useState<ExchangeRates | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchRates = async () => {
        try {
            const response = await fetch('/api/exchange-rates');
            const data = await response.json();

            if (data.success) {
                setRates(data.data.rates);
                setLastUpdated(new Date(data.data.lastUpdated));
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Failed to fetch exchange rates:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();

        // Refresh rates every 30 minutes
        const interval = setInterval(fetchRates, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="exchange-rate-display loading">
                <span className="exchange-icon">💱</span>
                <span className="exchange-text">{t('exchangeRate.loading')}</span>
            </div>
        );
    }

    if (error || !rates) {
        return null; // Hide on error
    }

    return (
        <div className="exchange-rate-display">
            <span className="exchange-icon">💱</span>
            <div className="exchange-rates">
                <div className="rate-item" title={t('exchangeRate.phpToKrw')}>
                    <span className="currency">₱1</span>
                    <span className="separator">=</span>
                    <span className="value">₩{rates.PHP.KRW.toFixed(2)}</span>
                </div>
                <div className="rate-divider">|</div>
                <div className="rate-item" title={t('exchangeRate.usdToKrw')}>
                    <span className="currency">$1</span>
                    <span className="separator">=</span>
                    <span className="value">₩{rates.USD.KRW.toFixed(0)}</span>
                </div>
            </div>
            {lastUpdated && (
                <div className="last-updated" title={lastUpdated.toLocaleString()}>
                    <span className="update-icon">🕐</span>
                </div>
            )}
        </div>
    );
};

export default ExchangeRateDisplay;
