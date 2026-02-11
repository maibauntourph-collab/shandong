import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
    user?: {
        username: string;
        role: string;
        [key: string]: any;
    };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, error: '인증이 필요합니다.' });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ success: false, error: '유효하지 않은 토큰입니다.' });
        }
        // Normalize legacy 'admin' role to 'owner'
        if (user.role === 'admin') user.role = 'owner';
        (req as AuthRequest).user = user;
        next();
    });
};

/**
 * Middleware: restrict route to specific roles.
 * Usage: router.delete('/:id', requireRole('owner'), handler)
 */
export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as AuthRequest).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: '권한이 부족합니다. (Insufficient permissions)',
            });
        }
        next();
    };
};

