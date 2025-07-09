import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/database';
import { ApiError, asyncHandler } from './errorHandler';
import { User } from '../types';
// Type extensions are automatically loaded from types/express.d.ts

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      throw new ApiError('Access token required', 401);
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET!
      ) as JWTPayload;

      // Get user from database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        throw new ApiError('User not found', 401);
      }

      // Check if user is active
      if (!user.is_active) {
        throw new ApiError('Account deactivated', 401);
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError('Invalid token', 401);
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError('Token expired', 401);
      }
      throw error;
    }
  }
);

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError('Authentication required', 401);
    }

    if (!roles.includes((req.user as User).role)) {
      throw new ApiError(
        'Insufficient permissions to access this resource', 
        403
      );
    }

    next();
  };
};

// Optional authentication (doesn't throw error if no token)
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (token) {
      try {
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET!
        ) as JWTPayload;

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', decoded.userId)
          .single();

        if (user && user.is_active) {
          req.user = user;
        }
      } catch (error) {
        // Silently ignore invalid tokens for optional auth
      }
    }

    next();
  }
);
