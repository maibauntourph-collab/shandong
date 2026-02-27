"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: '유효하지 않은 토큰입니다.' });
        }
        // Normalize legacy 'admin' role to 'owner'
        if (user.role === 'admin')
            user.role = 'owner';
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware: restrict route to specific roles.
 * Usage: router.delete('/:id', requireRole('owner'), handler)
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: '권한이 부족합니다. (Insufficient permissions)',
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
