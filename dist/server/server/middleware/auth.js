"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
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
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
