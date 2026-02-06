import { Router } from 'express';

const router = Router();

// Cache for exchange rates (1 hour TTL)
interface ExchangeRateCache {
    rates: {
        PHP: { KRW: number; USD: number };
        KRW: { PHP: number; USD: number };
        USD: { PHP: number; KRW: number };
    };
    lastUpdated: Date;
}

let rateCache: ExchangeRateCache | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Fetch exchange rates from ExchangeRate-API
const fetchExchangeRates = async (): Promise<ExchangeRateCache['rates']> => {
    try {
        // Fetch rates with USD as base
        const usdResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const usdData = await usdResponse.json();

        // Fetch rates with KRW as base
        const krwResponse = await fetch('https://api.exchangerate-api.com/v4/latest/KRW');
        const krwData = await krwResponse.json();

        // Fetch rates with PHP as base
        const phpResponse = await fetch('https://api.exchangerate-api.com/v4/latest/PHP');
        const phpData = await phpResponse.json();

        return {
            PHP: {
                KRW: phpData.rates.KRW,
                USD: phpData.rates.USD,
            },
            KRW: {
                PHP: krwData.rates.PHP,
                USD: krwData.rates.USD,
            },
            USD: {
                PHP: usdData.rates.PHP,
                KRW: usdData.rates.KRW,
            },
        };
    } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Return fallback rates if API fails
        return {
            PHP: { KRW: 23.5, USD: 0.018 },
            KRW: { PHP: 0.043, USD: 0.00076 },
            USD: { PHP: 56.5, KRW: 1320 },
        };
    }
};

// Get exchange rates with caching
router.get('/', async (req, res) => {
    try {
        const now = new Date();

        // Check if cache is valid
        if (rateCache && (now.getTime() - rateCache.lastUpdated.getTime()) < CACHE_DURATION) {
            return res.json({
                success: true,
                data: {
                    rates: rateCache.rates,
                    lastUpdated: rateCache.lastUpdated,
                    cached: true,
                },
            });
        }

        // Fetch fresh rates
        const rates = await fetchExchangeRates();

        // Update cache
        rateCache = {
            rates,
            lastUpdated: now,
        };

        res.json({
            success: true,
            data: {
                rates: rateCache.rates,
                lastUpdated: rateCache.lastUpdated,
                cached: false,
            },
        });
    } catch (error) {
        console.error('Exchange rate error:', error);
        res.status(500).json({
            success: false,
            error: '환율 정보를 가져올 수 없습니다.',
        });
    }
});

export default router;
