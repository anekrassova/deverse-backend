import { Router, Request, Response, NextFunction } from 'express';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { UserRole, User } from '../../user/model/user.model.js';
import { askAiValidator } from '../validator/ai.validator.js';
import { AiFeatureService } from '../service/ai-feature.service.js';

export const createAiRouter = (aiFeatureService: AiFeatureService): Router => {
  const router = Router();

  // ВОПРОС-ОТВЕТ С ИИ ПО ТЕМЕ ПРОЕКТА И IT
  /**
   * @openapi
   * /ai/ask:
   *   post:
   *     tags: [ai]
   *     summary: Ask AI about the project, IT, or programming (JWT required, roles User/Admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AiAskRequest'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AiAskResponse'
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/ask',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    askAiValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const { question } = req.body;

        const result = await aiFeatureService.answerQuestion(question, reqUser);

        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
