import { Request } from 'express';

declare global {
    namespace Express {
        interface User {
            username: string;
            role: string;
            [key: string]: any;
        }

        interface Request {
            user?: User;
        }
    }
}
