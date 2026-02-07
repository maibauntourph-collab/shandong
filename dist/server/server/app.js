"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = require("path");
const chat_js_1 = __importDefault(require("./routes/chat.js"));
const inquiries_js_1 = __importDefault(require("./routes/inquiries.js"));
const documents_js_1 = __importDefault(require("./routes/documents.js"));
const admin_js_1 = __importDefault(require("./routes/admin.js"));
const exchange_rates_js_1 = __importDefault(require("./routes/exchange-rates.js"));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Static files for uploads
app.use('/uploads', express_1.default.static((0, path_1.join)(process.cwd(), 'uploads')));
// API Routes
app.use('/api/chat', chat_js_1.default);
app.use('/api/inquiries', inquiries_js_1.default);
app.use('/api/documents', documents_js_1.default);
app.use('/api/admin', admin_js_1.default);
app.use('/api/exchange-rates', exchange_rates_js_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? '서버 오류가 발생했습니다.' : err.message
    });
});
exports.default = app;
