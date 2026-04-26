import { Router } from 'express';
import { UserRepository } from './repository/user.repository.js';
import { AuthService } from './service/auth.service.js';
import { createAuthRouter } from './routes/auth.routes.js';
import { FollowerRepository } from './repository/follower.repository.js';
import { FollowerService } from './service/follower.service.js';
import { createFollowerRouter } from './routes/follower.routes.js';

export const userRoutes = (): Router => {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository);
  const followerRepository = new FollowerRepository();
  const followerService = new FollowerService(followerRepository, userRepository);

  const router = Router();
  router.use(createAuthRouter(authService));
  router.use(createFollowerRouter(followerService));

  return router;
};
