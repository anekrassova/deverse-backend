import { Router, Request, Response, NextFunction } from 'express';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';
import { UserRole, User } from '../model/user.model.js';
import { UserService } from '../service/user.service.js';
import upload from '../../../config/multer.js';

export const createUserRouter = (userService: UserService): Router => {
  const router = Router();

  // ПОИСК ПОЛЬЗОВАТЕЛЕЙ
  /**
   * @openapi
   * /user/search:
   *   get:
   *     tags: [user]
   *     summary: Search users (JWT no, public)
   *     parameters:
   *       - in: query
   *         name: query
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: Bad Request
   */
  router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = String(req.query.query || '');
      const users = await userService.searchUsers(query);

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  });

  // ИЗМЕНЕНИЕ КАРТИНКИ АВАТАРА
  /**
   * @openapi
   * /user/changeProfileAvatar:
   *   post:
   *     tags: [user]
   *     summary: Change profile avatar (JWT required, roles User/Admin; only self)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               avatar:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/changeProfileAvatar',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    upload.single('avatar'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const file = req.file as Express.Multer.File;

        const user = await userService.changeProfileAvatar(reqUser, file);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },
  );

  // ИЗМЕНЕНИЕ КАРТИНКИ HEADER
  /**
   * @openapi
   * /user/changeProfileHeader:
   *   post:
   *     tags: [user]
   *     summary: Change profile header (JWT required, roles User/Admin; only self)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               header:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/changeProfileHeader',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    upload.single('header'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const file = req.file as Express.Multer.File;

        const user = await userService.changeProfileHeaderImage(reqUser, file);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
