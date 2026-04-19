import { Router } from 'express';
import { PostRepository } from './repository/post.repository.js';
import { PostCommentRepository } from './repository/post_comment.repository.js';
import { LikeRepository } from './repository/like.repository.js';
import { PostService } from './service/post.service.js';
import { CommentService } from './service/comment.service.js';
import { LikeService } from './service/like.service.js';
import { AiService } from '../ai/ai.service.js';
import { createPostRouter } from './routes/post.routes.js';
import { createCommentRouter } from './routes/comment.routes.js';
import { createLikeRouter } from './routes/like.routes.js';

export const postRoutes = (): Router => {
  const postRepository = new PostRepository();
  const postCommentRepository = new PostCommentRepository();
  const likeRepository = new LikeRepository();
  const aiService = new AiService();
  const postService = new PostService(postRepository, aiService);
  const commentService = new CommentService(postCommentRepository);
  const likeService = new LikeService(likeRepository);

  const router = Router();
  router.use(createPostRouter(postService));
  router.use('/comment', createCommentRouter(commentService));
  router.use('/like', createLikeRouter(likeService));

  return router;
};
