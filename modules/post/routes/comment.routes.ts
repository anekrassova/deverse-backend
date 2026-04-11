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

  return router;
};

