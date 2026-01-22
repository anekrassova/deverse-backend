import { Post } from '../model/post.model.js';
import { sequelize } from '../../../config/database.js';
import { ProjectionAlias } from 'sequelize';

export interface CreatePostData {
  user_id: number;
  content: string;
}

export interface UpdatePostData {
  content?: string;
}

export class PostRepository {
  private baseAttributes(): { include: ProjectionAlias[] } {
    return {
      include: [
        [
          sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes.post_id = post.id)`),
          'likesCount',
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM post_comments WHERE post_comments.post_id = post.id)`,
          ),
          'commentsCount',
        ],
      ],
    };
  }

  // СОЗДАТЬ ПОСТ
  async create(data: CreatePostData): Promise<Post> {
    return Post.create(data);
  }

  // НАЙТИ ПОСТ ПО АЙДИ
  async readById(postId: number): Promise<Post | null> {
    return Post.findByPk(postId, {
      attributes: this.baseAttributes(),
    });
  }

  // НАЙТИ ВСЕ ПОСТЫ
  async readAll(): Promise<Post[]> {
    return Post.findAll({
      attributes: this.baseAttributes(),
      order: [['created_at', 'DESC']],
    });
  }

  // НАЙТИ ПОСТЫ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
  async readAllByUserId(userId: number): Promise<Post[]> {
    return Post.findAll({
      where: { user_id: userId },
      attributes: this.baseAttributes(),
      order: [['created_at', 'DESC']],
    });
  }

  // ОБНОВИТЬ ПОСТ (ИЗМЕНИТЬ СОДЕРЖИМОЕ)
  async update(postId: number, data: UpdatePostData): Promise<Post> {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return post.update(data);
  }

  // УДАЛИТЬ ПОСТ
  async delete(postId: number): Promise<void> {
    await Post.destroy({
      where: { id: postId },
    });
  }
}
