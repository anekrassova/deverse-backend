import { Router } from 'express';
import { ProjectRepository } from './repository/project.repository.js';
import { ProjectService } from './service/project.service.js';
import { createProjectRouter } from './routes/project.routes.js';

export const projectRoutes = (): Router => {
  const projectRepository = new ProjectRepository();
  const projectService = new ProjectService(projectRepository);

  const router = Router();
  router.use(createProjectRouter(projectService));

  return router;
};
