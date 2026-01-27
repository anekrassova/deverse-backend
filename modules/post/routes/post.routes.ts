import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole, User } from '../../user/model/user.model.js';

import { PostService } from '../service/post.service.js';

export const createPostRouter = (postService: PostService): Router => {
  const router = Router();

  // СОЗДАТЬ ПОСТ
  router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const { content } = req.body;

        const newPost = await postService.createPost(reqUser.id, content);

        res.status(201).json(newPost);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ПОСТ ПО АЙДИ
  router.get(
    '/get/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const post = await postService.getPostById(id);

        res.status(200).json(post);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ВСЕ ПОСТЫ ПОЛЬЗОВАТЕЛЯ
  router.get(
    '/users/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = Number(req.params.id);
        const posts = await postService.getUsersPosts(userId);

        res.status(200).json(posts);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ САММАРИ ПОСТА
  router.get(
    '/summary/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);

        const result = await postService.getPostSummary(id);

        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ КОММЕНТАРИИ К ПОСТУ

  // РЕДАКТИРОВАТЬ КОНТЕНТ ПОСТА
  router.patch(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const reqUser = req.user as User;
        const { content } = req.body;

        const post = await postService.updatePostContent(id, content, reqUser);

        res.status(200).json(post);
      } catch (error) {
        next(error);
      }
    },
  );

  // УДАЛИТЬ ПОСТ
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

        await postService.deletePostById(id, reqUser);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
