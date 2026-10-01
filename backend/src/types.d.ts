import { Request } from 'express';
import { UserPayload } from './schema/user.payload';

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload
        }
    }
}