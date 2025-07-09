import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  const accessTokenOptions: any = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'planmorph-api',
    audience: 'planmorph-client'
  };

  const refreshTokenOptions: any = {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'planmorph-api',
    audience: 'planmorph-client'
  };

  const accessToken = jwt.sign(payload, secret, accessTokenOptions);
  const refreshToken = jwt.sign(payload, secret, refreshTokenOptions);

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return jwt.verify(token, secret) as TokenPayload;
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string, 
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
