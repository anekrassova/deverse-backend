import { Router } from 'express';
import { UserRepository } from './repository/user.repository.js';
import { AuthService } from './service/auth.service.js';
import { createAuthRouter } from './routes/auth.routes.js';

export const createUserRoutes = (): Router => {
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository);

    const router = Router();
    router.use(createAuthRouter(authService));

    return router;
};
