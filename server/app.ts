import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRouter from './routes/chat.js';
import inquiriesRouter from './routes/inquiries.js';
import documentsRouter from './routes/documents.js';
import adminRouter from './routes/admin.js';
import exchangeRatesRouter from './routes/exchange-rates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/exchange-rates', exchangeRatesRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? '서버 오류가 발생했습니다.' : err.message
    });
});

export default app;
