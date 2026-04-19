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
  private baseAttributes(currentUserId?: number): { include: ProjectionAlias[] } {
    return {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM \`like\` WHERE \`like\`.post_id = Post.id)`,
          ),
          'likesCount',
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = Post.id)`,
          ),
          'commentsCount',
        ],
        [
          currentUserId
            ? sequelize.literal(
                `(EXISTS(SELECT 1 FROM \`like\` WHERE \`like\`.post_id = Post.id AND \`like\`.user_id = ${sequelize.escape(
                  currentUserId,
                )}))`,
              )
            : sequelize.literal('0'),
          'isLiked',
        ],
      ],
    };
  }

  // СОЗДАТЬ ПОСТ
  async create(data: CreatePostData): Promise<Post> {
    return Post.create(data);
  }

  // НАЙТИ ПОСТ ПО АЙДИ
  async readById(postId: number, currentUserId?: number): Promise<Post | null> {
    return Post.findByPk(postId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
        include: this.baseAttributes(currentUserId).include,
      },
    });
  }

  // НАЙТИ ВСЕ ПОСТЫ
  async readAll(currentUserId?: number): Promise<Post[]> {
    return Post.findAll({
      attributes: {
        exclude: ['created_at', 'updated_at'],
        include: this.baseAttributes(currentUserId).include,
      },
      order: [['created_at', 'DESC']],
    });
  }

  // НАЙТИ ПОСТЫ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
  async readAllByUserId(userId: number, currentUserId?: number): Promise<Post[]> {
    return Post.findAll({
      where: { user_id: userId },
      attributes: {
        exclude: ['created_at', 'updated_at'],
        include: this.baseAttributes(currentUserId).include,
      },
      order: [['created_at', 'DESC']],
    });
  }

  // ОБНОВИТЬ ПОСТ (ИЗМЕНИТЬ СОДЕРЖИМОЕ)
  async update(postId: number, data: UpdatePostData): Promise<Post> {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    await post.update(data);

    return Post.findByPk(postId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
        include: this.baseAttributes().include,
      },
    }) as Promise<Post>;
  }

  // УДАЛИТЬ ПОСТ
  async delete(postId: number): Promise<void> {
    await Post.destroy({
      where: { id: postId },
    });
  }
}
