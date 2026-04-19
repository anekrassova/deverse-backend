import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole, User } from '../../user/model/user.model.js';
import { CommentService } from '../service/comment.service.js';

export const createCommentRouter = (commentService: CommentService): Router => {
  const router = Router();

  // СОЗДАТЬ КОММЕНТАРИЙ
  /**
   * @openapi
   * /post/comment/create:
   *   post:
   *     tags: [comment]
   *     summary: Create comment
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CommentCreateRequest'
   *     responses:
   *       201:
   *         description: Created
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const { post_id, content } = req.body;

        const newComment = await commentService.createComment(
          reqUser.id,
          Number(post_id),
          content,
        );

        res.status(201).json(newComment);
      } catch (error) {
        next(error);
      }
    },
  );

  // УДАЛИТЬ КОММЕНТАРИЙ
  /**
   * @openapi
   * /post/comment/delete/{id}:
   *   delete:
   *     tags: [comment]
   *     summary: Delete comment
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
   *         description: Comment not found
   */
  router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const reqUser = req.user as User;

        await commentService.deleteCommentById(id, reqUser);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  // РЕДАКТИРОВАТЬ КОММЕНТАРИЙ
  /**
   * @openapi
   * /post/comment/update/{id}:
   *   patch:
   *     tags: [comment]
   *     summary: Update comment
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CommentUpdateRequest'
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Comment not found
   */
  router.patch(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const commentId = Number(req.params.id);
        const reqUser = req.user as User;
        const { content } = req.body;

        const updated = await commentService.updateCommentContent(
          commentId,
          content,
          reqUser,
        );

        res.status(200).json(updated);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
