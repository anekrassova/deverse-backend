import { Request, Response, NextFunction } from 'express';
import passport from '../../config/passport.js';
import { User } from '../../modules/user/model/user.model.js';

export const optionalJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: unknown, user: User) => {
    if (err) {
      return next(err);
    }

    if (user) {
      req.user = user;
    }

    return next();
  })(req, res, next);
};
