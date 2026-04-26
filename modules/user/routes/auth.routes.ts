import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/auth.service.js';
import { loginValidator, registerValidator } from '../validator/auth.validator.js';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';

export const createAuthRouter = (authService: AuthService): Router => {
  const router = Router();

  /**
   * @openapi
   * /user/register:
   *   post:
   *     tags: [user]
   *     summary: Register new user (JWT no, public)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegisterRequest'
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: User already exists / Username already in use
   */
  router.post(
    '/register',
    registerValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, surname, username, profession, email, password } = req.body;

        const user = await authService.register(
          name,
          surname,
          username,
          profession,
          email,
          password,
        );

        res.status(201).json({
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          username: user.username,
          role: user.role,
        });
      } catch (error) {
        next(error);
      }
    },
  );

  /**
   * @openapi
   * /user/login:
   *   post:
   *     tags: [user]
   *     summary: Login user (JWT no, public)
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLoginRequest'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserLoginResponse'
   *       401:
   *         description: Invalid credentials
   */
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
    },
  );

  return router;
};
