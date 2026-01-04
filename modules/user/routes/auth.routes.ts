import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/auth.service.js';
import { loginValidator, registerValidator } from '../validator/auth.validator.js';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';

export const createAuthRouter = (authService: AuthService): Router => {
    const router = Router();

    router.post(
        '/register',
        registerValidator,
        handleValidation,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, username, password } = req.body;

                const user = await authService.register(
                    email,
                    username,
                    password
                );

                res.status(201).json({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                });
            } catch (error) {
                next(error);
            }
        }
    );

    router.post(
        '/login',
        loginValidator,
        handleValidation,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const { email, password } = req.body;

                const result = await authService.login(email, password);

                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        }
    );

    return router;
};
