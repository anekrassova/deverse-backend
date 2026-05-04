import { Project } from '../model/project.model.js';

export interface CreateProjectData {
  user_id: number;
  title: string;
  description: string;
  url: string;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  url?: string;
}

export class ProjectRepository {
  // СОЗДАТЬ ПРОЕКТ
  async create(data: CreateProjectData): Promise<Project> {
    return Project.create(data);
  }

  // НАЙТИ ПРОЕКТ ПО АЙДИ
  async readById(projectId: number): Promise<Project | null> {
    return Project.findByPk(projectId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });
  }

  // НАЙТИ ВСЕ ПРОЕКТЫ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
  async readAllByUserId(userId: number): Promise<Project[]> {
    return Project.findAll({
      where: { user_id: userId },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      order: [['created_at', 'DESC']],
    });
  }

  // НАЙТИ ВСЕ ПРОЕКТЫ
  async readAll(): Promise<Project[]> {
    return Project.findAll({
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      order: [['created_at', 'DESC']],
    });
  }

  // ОБНОВИТЬ ПРОЕКТ
  async update(projectId: number, data: UpdateProjectData): Promise<Project> {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    await project.update(data);

    return Project.findByPk(projectId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    }) as Promise<Project>;
  }

  // УДАЛИТЬ ПРОЕКТ
  async delete(projectId: number): Promise<void> {
    await Project.destroy({
      where: { id: projectId },
    });
  }
}
