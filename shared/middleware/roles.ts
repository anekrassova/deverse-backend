import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../modules/user/model/user.model.js';

export const roles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
