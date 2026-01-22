import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../modules/user/model/user.model.js';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: number;
  role: UserRole;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
