import jwt, { Secret } from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  role: 'USER' | 'ADMIN';
}

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return secret;
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};
