import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';  // ← ADD THIS LINE
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRouter from './routes/chat.js';
import inquiriesRouter from './routes/inquiries.js';
import documentsRouter from './routes/documents.js';
import adminRouter from './routes/admin.js';
import exchangeRatesRouter from './routes/exchange-rates.js';
import menusRouter from './routes/menus.js';
import galleryRouter from './routes/gallery.js';
import inventoryRouter from './routes/inventory.js';
import analyticsRouter from './routes/analytics.js';

const app = express();

// Middleware
app.use(cors({  // ← UPDATED (was just cors())
    origin: 'http://localhost:5174',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploads
app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/exchange-rates', exchangeRatesRouter);
app.use('/api/menus', menusRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/analytics', analyticsRouter);

// Health check - UPDATED
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,  // ← ADDED THIS
        timestamp: new Date().toISOString()
    });
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