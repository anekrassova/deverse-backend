import { Router } from 'express';
import { AiService } from './ai.service.js';
import { AiFeatureService } from './service/ai-feature.service.js';
import { createAiRouter } from './routes/ai.routes.js';

export const aiRoutes = (): Router => {
  const aiService = new AiService();
  const aiFeatureService = new AiFeatureService(aiService);

  const router = Router();
  router.use(createAiRouter(aiFeatureService));

  return router;
};
