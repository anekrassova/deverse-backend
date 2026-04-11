import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole } from '../model/user.model.js';

import upload from '../../../config/multer.js';
import { UserService } from '../service/user.service.js';

const createUserRouter = (userService: UserService): Router => {
  const router = Router();

  // todo complete profile photo upload
  router.post(
    '/changeProfileAvatar',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    upload.single('avatar'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'File does not uploaded.' });
        }
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
