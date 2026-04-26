import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole, User } from '../model/user.model.js';
import { FollowerService } from '../service/follower.service.js';

export const createFollowerRouter = (followerService: FollowerService): Router => {
  const router = Router();

  // ПОДПИСАТЬСЯ НА ПОЛЬЗОВАТЕЛЯ
  /**
   * @openapi
   * /user/follow/{id}:
   *   post:
   *     tags: [follow]
   *     summary: Follow user (JWT required, role User only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Already following / You cannot follow yourself
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: User not found
   */
  router.post(
    '/follow/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const targetUserId = Number(req.params.id);
        const reqUser = req.user as User;

        const follower = await followerService.followUser(targetUserId, reqUser);

        res.status(201).json(follower);
      } catch (error) {
        next(error);
      }
    },
  );

  // ОТПИСАТЬСЯ ОТ ПОЛЬЗОВАТЕЛЯ
  /**
   * @openapi
   * /user/unfollow/{id}:
   *   delete:
   *     tags: [follow]
   *     summary: Unfollow user (JWT required, role User only; only if subscribed)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       204:
   *         description: No Content
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Subscription not found
   */
  router.delete(
    '/unfollow/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const targetUserId = Number(req.params.id);
        const reqUser = req.user as User;

        await followerService.unfollowUser(targetUserId, reqUser);

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ПОДПИСЧИКОВ ПОЛЬЗОВАТЕЛЯ
  /**
   * @openapi
   * /user/followers/{id}:
   *   get:
   *     tags: [follow]
   *     summary: Get followers by user id (JWT no, public)
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
    '/followers/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = Number(req.params.id);
        const followers = await followerService.getFollowers(userId);

        res.status(200).json(followers);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ПОДПИСКИ ПОЛЬЗОВАТЕЛЯ
  /**
   * @openapi
   * /user/following/{id}:
   *   get:
   *     tags: [follow]
   *     summary: Get following by user id (JWT no, public)
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
    '/following/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = Number(req.params.id);
        const following = await followerService.getFollowing(userId);

        res.status(200).json(following);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};

