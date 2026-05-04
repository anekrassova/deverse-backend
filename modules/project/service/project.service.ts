import { CustomError } from '../../../shared/errors.js';
import { assertOwnershipOrAdmin } from '../../../shared/permissions.js';
import { User, UserRole } from '../../user/model/user.model.js';
import {
  ProjectRepository,
  UpdateProjectData,
} from '../repository/project.repository.js';
import { ProjectApplicationRepository } from '../repository/project_application.repository.js';
import { UserRepository } from '../../user/repository/user.repository.js';
import { sendMail } from '../../../config/mailer.js';

export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectApplicationRepository: ProjectApplicationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // СОЗДАТЬ ПРОЕКТ
  async createProject(user_id: number, title: string, description: string, url: string) {
    return this.projectRepository.create({ user_id, title, description, url });
  }

  // ПОЛУЧИТЬ ПРОЕКТ ПО АЙДИ
  async getProjectById(projectId: number) {
    const project = await this.projectRepository.readById(projectId);

    if (!project) {
      throw new CustomError(404, 'Project not found');
    }

    return project;
  }

  // ПОЛУЧИТЬ ВСЕ ПРОЕКТЫ ПОЛЬЗОВАТЕЛЯ
  async getUsersProjects(user_id: number) {
    return this.projectRepository.readAllByUserId(user_id);
  }

  // ПОЛУЧИТЬ ВСЕ ПРОЕКТЫ
  async getAllProjects() {
    return this.projectRepository.readAll();
  }

  // ОТПРАВИТЬ ЗАЯВКУ НА УЧАСТИЕ В ПРОЕКТЕ
  async applyToProject(projectId: number, requestUser: User) {
    if (requestUser.role !== UserRole.User) {
      throw new CustomError(403, 'Forbidden');
    }

    const project = await this.projectRepository.readById(projectId);

    if (!project) {
      throw new CustomError(404, 'Project not found');
    }

    if (project.user_id === requestUser.id) {
      throw new CustomError(400, 'You cannot apply to your own project');
    }

    const exists = await this.projectApplicationRepository.readByProjectAndUser(
      projectId,
      requestUser.id,
    );

    if (exists) {
      throw new CustomError(400, 'Application already exists');
    }

    const application = await this.projectApplicationRepository.create(
      projectId,
      requestUser.id,
    );

    const owner = await this.userRepository.findById(project.user_id);
    if (owner?.email) {
      const subject = 'Deverse: a new application for participation in your project';
      const text = `
        Hi, ${owner.name},
        
        ${requestUser.name} wants to participate in your project.
        
        Contact information:
        Username: ${requestUser.username}
        Email: ${requestUser.email}
        
        Best regards,
        Deverse Team
        `;

      await sendMail(owner.email, subject, text);
    }

    return application;
  }

  // ОБНОВИТЬ ПРОЕКТ
  async updateProject(projectId: number, data: UpdateProjectData, requestUser: User) {
    const project = await this.projectRepository.readById(projectId);

    if (!project) {
      throw new CustomError(404, 'Project not found');
    }

    assertOwnershipOrAdmin(requestUser, project.user_id);

    return this.projectRepository.update(projectId, data);
  }

  // УДАЛИТЬ ПРОЕКТ
  async deleteProjectById(projectId: number, requestUser: User) {
    const project = await this.projectRepository.readById(projectId);

    if (!project) {
      throw new CustomError(404, 'Project not found');
    }

    assertOwnershipOrAdmin(requestUser, project.user_id);

    await this.projectRepository.delete(projectId);
  }
}
