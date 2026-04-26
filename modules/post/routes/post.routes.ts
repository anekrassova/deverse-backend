import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';
import { optionalJwt } from '../../../shared/middleware/optionalJwt.js';

import { UserRole, User } from '../../user/model/user.model.js';

import { PostService } from '../service/post.service.js';

export const createPostRouter = (postService: PostService): Router => {
  const router = Router();

  // СОЗДАТЬ ПОСТ
  /**
   * @openapi
   * /post/create:
   *   post:
   *     tags: [post]
   *     summary: Create post (JWT required, roles User/Admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/PostCreateRequest'
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
        const { content } = req.body;

        const newPost = await postService.createPost(reqUser.id, content);

        res.status(201).json(newPost);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ПОСТ ПО АЙДИ
  /**
   * @openapi
   * /post/get/{id}:
   *   get:
   *     tags: [post]
   *     summary: Get post by id (JWT optional, public; isLiked with JWT)
   *     security:
   *       - bearerAuth: []
   *       - {}
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
   *         description: Post not found
   */
  router.get(
    '/get/:id',
    optionalJwt,
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const reqUser = req.user as User | undefined;
        const post = await postService.getPostById(id, reqUser?.id);

        res.status(200).json(post);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ВСЕ ПОСТЫ ПОЛЬЗОВАТЕЛЯ
  /**
   * @openapi
   * /post/users/{id}:
   *   get:
   *     tags: [post]
   *     summary: Get all posts by user id (JWT optional, public; isLiked with JWT)
   *     security:
   *       - bearerAuth: []
   *       - {}
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: OK
   */
  router.get(
    '/users/:id',
    optionalJwt,
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = Number(req.params.id);
        const reqUser = req.user as User | undefined;
        const posts = await postService.getUsersPosts(userId, reqUser?.id);

        res.status(200).json(posts);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ САММАРИ ПОСТА
  /**
   * @openapi
   * /post/summary/{id}:
   *   get:
   *     tags: [post]
   *     summary: Get post summary by id (JWT no, public)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PostSummaryResponse'
   *       404:
   *         description: Post not found
   */
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
  /**
   * @openapi
   * /post/comments/{id}:
   *   get:
   *     tags: [comment]
   *     summary: Get all comments for post (JWT no, public)
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
   *         description: Post not found
   */
  router.get(
    '/comments/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const postId = Number(req.params.id);
        const comments = await postService.getPostComments(postId);

        res.status(200).json(comments);
      } catch (error) {
        next(error);
      }
    },
  );

  // РЕДАКТИРОВАТЬ КОНТЕНТ ПОСТА
  /**
   * @openapi
   * /post/update/{id}:
   *   patch:
   *     tags: [post]
   *     summary: Update post content (JWT required, roles User/Admin; owner or Admin)
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
   *             $ref: '#/components/schemas/PostUpdateRequest'
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Post not found
   */
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
  /**
   * @openapi
   * /post/delete/{id}:
   *   delete:
   *     tags: [post]
   *     summary: Delete post (JWT required, roles User/Admin; owner or Admin)
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
   *         description: Post not found
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

        await postService.deletePostById(id, reqUser);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
