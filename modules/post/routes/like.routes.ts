import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole, User } from '../../user/model/user.model.js';
import { LikeService } from '../service/like.service.js';

export const createLikeRouter = (likeService: LikeService): Router => {
  const router = Router();

  // ПОСТАВИТЬ ЛАЙК НА ПОСТ
  /**
   * @openapi
   * /post/like/create/{id}:
   *   post:
   *     tags: [like]
   *     summary: Like post (JWT required, roles User/Admin)
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
   *         description: Like already exists
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/create/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const postId = Number(req.params.id);
        const reqUser = req.user as User;

        const like = await likeService.likePost(postId, reqUser);

        res.status(201).json(like);
      } catch (error) {
        next(error);
      }
    },
  );

  // УДАЛИТЬ ЛАЙК С ПОСТА
  /**
   * @openapi
   * /post/like/delete/{id}:
   *   delete:
   *     tags: [like]
   *     summary: Unlike post (JWT required, roles User/Admin; only own like)
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
   *         description: Like not found
   */
  router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const postId = Number(req.params.id);
        const reqUser = req.user as User;

        await likeService.unlikePost(postId, reqUser);

        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
