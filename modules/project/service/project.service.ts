import { CustomError } from '../../../shared/errors.js';
import { assertOwnershipOrAdmin } from '../../../shared/permissions.js';
import { User } from '../../user/model/user.model.js';
import { ProjectRepository, UpdateProjectData } from '../repository/project.repository.js';

export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  // СОЗДАТЬ ПРОЕКТ
  async createProject(
    user_id: number,
    title: string,
    description: string,
    url: string,
  ) {
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

  // ОБНОВИТЬ ПРОЕКТ
  async updateProject(
    projectId: number,
    data: UpdateProjectData,
    requestUser: User,
  ) {
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

