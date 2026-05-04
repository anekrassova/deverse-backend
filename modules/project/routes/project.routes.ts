import { Router, Request, Response, NextFunction } from 'express';
import { handleValidation } from '../../../shared/middleware/handleValidation.js';
import { idParamValidator } from '../../../shared/validator/idParamValidator.js';
import passport from '../../../config/passport.js';
import { roles } from '../../../shared/middleware/roles.js';

import { UserRole, User } from '../../user/model/user.model.js';
import { ProjectService } from '../service/project.service.js';

export const createProjectRouter = (projectService: ProjectService): Router => {
  const router = Router();

  // ПОЛУЧИТЬ ВСЕ ПРОЕКТЫ
  /**
   * @openapi
   * /project/all:
   *   get:
   *     tags: [project]
   *     summary: Get all projects (JWT no, public)
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await projectService.getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  });

  // СОЗДАТЬ ПРОЕКТ
  /**
   * @openapi
   * /project/create:
   *   post:
   *     tags: [project]
   *     summary: Create project (JWT required, roles User/Admin)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectCreateRequest'
   *     responses:
   *       201:
   *         description: Created
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reqUser = req.user as User;
        const { title, description, url } = req.body;

        const project = await projectService.createProject(
          reqUser.id,
          title,
          description,
          url,
        );

        res.status(201).json(project);
      } catch (error) {
        next(error);
      }
    },
  );

  // ОТПРАВИТЬ ЗАЯВКУ НА УЧАСТИЕ В ПРОЕКТЕ
  /**
   * @openapi
   * /project/apply/{id}:
   *   post:
   *     tags: [project]
   *     summary: Apply to project (JWT required, role User only; not own project)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Bad Request
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Project not found
   */
  router.post(
    '/apply/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const projectId = Number(req.params.id);
        const reqUser = req.user as User;

        const application = await projectService.applyToProject(projectId, reqUser);

        res.status(201).json(application);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ПРОЕКТ ПО АЙДИ
  /**
   * @openapi
   * /project/get/{id}:
   *   get:
   *     tags: [project]
   *     summary: Get project by id (JWT no, public)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: OK
   *       404:
   *         description: Project not found
   */
  router.get(
    '/get/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const project = await projectService.getProjectById(id);

        res.status(200).json(project);
      } catch (error) {
        next(error);
      }
    },
  );

  // ПОЛУЧИТЬ ВСЕ ПРОЕКТЫ ПОЛЬЗОВАТЕЛЯ
  /**
   * @openapi
   * /project/users/{id}:
   *   get:
   *     tags: [project]
   *     summary: Get all projects by user id (JWT no, public)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: OK
   */
  router.get(
    '/users/:id',
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = Number(req.params.id);
        const projects = await projectService.getUsersProjects(userId);

        res.status(200).json(projects);
      } catch (error) {
        next(error);
      }
    },
  );

  // ОБНОВИТЬ ПРОЕКТ
  /**
   * @openapi
   * /project/update/{id}:
   *   patch:
   *     tags: [project]
   *     summary: Update project (JWT required, roles User/Admin; owner or Admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ProjectUpdateRequest'
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Project not found
   */
  router.patch(
    '/update/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const reqUser = req.user as User;
        const { title, description, url } = req.body;

        const project = await projectService.updateProject(
          id,
          { title, description, url },
          reqUser,
        );

        res.status(200).json(project);
      } catch (error) {
        next(error);
      }
    },
  );

  // УДАЛИТЬ ПРОЕКТ
  /**
   * @openapi
   * /project/delete/{id}:
   *   delete:
   *     tags: [project]
   *     summary: Delete project (JWT required, roles User/Admin; owner or Admin)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       204:
   *         description: No Content
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Project not found
   */
  router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    roles([UserRole.User, UserRole.Admin]),
    idParamValidator,
    handleValidation,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const reqUser = req.user as User;

        await projectService.deleteProjectById(id, reqUser);
        res.status(204).end();
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
};
