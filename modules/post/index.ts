import { Router } from 'express';
import { PostRepository } from './repository/post.repository.js';
import { PostService } from './service/post.service.js';
import { AiService } from '../ai/ai.service.js';
import { createPostRouter } from './routes/post.routes.js';

export const postRoutes = (): Router => {
  const postRepository = new PostRepository();
  const aiService = new AiService();
  const postService = new PostService(postRepository, aiService);

  const router = Router();
  router.use(createPostRouter(postService));

  return router;
};
