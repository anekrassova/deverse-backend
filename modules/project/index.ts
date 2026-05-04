import { Router } from 'express';
import { ProjectRepository } from './repository/project.repository.js';
import { ProjectService } from './service/project.service.js';
import { createProjectRouter } from './routes/project.routes.js';
import { ProjectApplicationRepository } from './repository/project_application.repository.js';
import { UserRepository } from '../user/repository/user.repository.js';

export const projectRoutes = (): Router => {
  const projectRepository = new ProjectRepository();
  const projectApplicationRepository = new ProjectApplicationRepository();
  const userRepository = new UserRepository();
  const projectService = new ProjectService(
    projectRepository,
    projectApplicationRepository,
    userRepository,
  );

  const router = Router();
  router.use(createProjectRouter(projectService));

  return router;
};
