// Type declarations for Express.js extensions
import { User } from './types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
