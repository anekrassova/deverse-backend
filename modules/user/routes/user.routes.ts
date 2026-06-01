import { Router, Request, Response, NextFunction } from 'express';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import { UserRole, User } from '../model/user.model.js';
import { UserService } from '../service/user.service.js';
import upload from '../../../config/multer.js';
import {
  adminChangePasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
  userSearchValidator,
} from '../validator/user.validator.js';

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
  router.get(
    '/search',
    userSearchValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = String(req.query.query || '');
        const users = await userService.searchUsers(query);

        res.status(200).json(users);
      } catch (error) {
        next(error);
      }
    },
  );

  // РЕДАКТИРОВАНИЕ ПРОФИЛЯ
  /**
   * @openapi
   * /user/updateProfile:
   *   patch:
   *     tags: [user]
   *     summary: Update current user profile (JWT required, roles User/Admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdateProfileRequest'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserPublicResponse'
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.patch(
    '/updateProfile',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    updateProfileValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const { name, surname, username, profession } = req.body;

        const user = await userService.updateProfile(reqUser, {
          name,
          surname,
          username,
          profession,
        });

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },
  );

  // СМЕНА ПАРОЛЯ
  /**
   * @openapi
   * /user/changePassword:
   *   patch:
   *     tags: [user]
   *     summary: Change current user password (JWT required, roles User/Admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserChangePasswordRequest'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserPublicResponse'
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.patch(
    '/changePassword',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    changePasswordValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const { password } = req.body;

        const user = await userService.changePassword(reqUser, password);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },
  );

  // АДМИНСКАЯ СМЕНА ПАРОЛЯ ПО ЭМЕЙЛУ
  /**
   * @openapi
   * /user/changePasswordByEmail:
   *   patch:
   *     tags: [user]
   *     summary: Change any user password by email (JWT required, role Admin only)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserAdminChangePasswordRequest'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserPublicResponse'
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  router.patch(
    '/changePasswordByEmail',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.Admin]),
    adminChangePasswordValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;

        const user = await userService.changePasswordByEmail(email, password);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },
  );

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

        console.log('[changeProfileAvatar] request received', {
          userId: reqUser?.id,
          headers: {
            'content-type': req.headers['content-type'],
            authorization: req.headers.authorization ? 'present' : 'missing',
          },
          body: req.body,
          file: file
            ? {
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: (file as any).path,
                filename: (file as any).filename,
              }
            : null,
        });

        const user = await userService.changeProfileAvatar(reqUser, file);

        console.log('[changeProfileAvatar] success', {
          userId: reqUser?.id,
          avatarUrl: user.avatar_url,
        });

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

  // ПОЛУЧИТЬ ПОЛЬЗОВАТЕЛЯ ПО АЙДИ
  /**
   * @openapi
   * /user/get/{id}:
   *   get:
   *     tags: [user]
   *     summary: Get user by id (JWT no, public)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: User not found
   */
  router.get(
    '/get/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const user = await userService.getUserById(id);

        res.status(200).json(user);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
