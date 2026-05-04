import { ProjectApplication } from '../model/project_application.model.js';

export class ProjectApplicationRepository {
  // СОЗДАТЬ ЗАЯВКУ НА УЧАСТИЕ В ПРОЕКТЕ
  async create(project_id: number, user_id: number): Promise<ProjectApplication> {
    return ProjectApplication.create({ project_id, user_id });
  }

  // НАЙТИ ЗАЯВКУ ПОЛЬЗОВАТЕЛЯ НА ПРОЕКТЕ
  async readByProjectAndUser(
    projectId: number,
    userId: number,
  ): Promise<ProjectApplication | null> {
    return ProjectApplication.findOne({
      where: { project_id: projectId, user_id: userId },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });
  }
}
