import jwt, { Secret } from 'jsonwebtoken';
import { UserRole } from '../modules/user/model/user.model.js';

export interface JwtPayload {
  userId: number;
  role: UserRole;
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
