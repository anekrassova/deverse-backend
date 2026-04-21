import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';
import { UserRole } from '../model/user.model.js';
import { UserService } from '../service/user.service.js';

const createUserRouter = (userService: UserService): Router => {
  const router = Router();

  // todo complete profile photo upload
  router.post(
    '/changeProfileAvatar',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // todo file upload will be implemented with MinIO
        return res.status(501).json({ message: 'Not implemented yet.' });
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
