import { PostComment } from '../model/post_comment.model.js';
import { User } from '../../user/model/user.model.js';

export interface CreatePostCommentData {
  post_id: number;
  user_id: number;
  content: string;
}

export interface UpdatePostCommentData {
  content?: string;
}

export class PostCommentRepository {
  // СОЗДАТЬ КОММЕНТАРИЙ
  async create(data: CreatePostCommentData): Promise<PostComment> {
    return PostComment.create(data);
  }

  // НАЙТИ КОММЕНТАРИЙ ПО АЙДИ
  async readById(commentId: number): Promise<PostComment | null> {
    return PostComment.findByPk(commentId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });
  }

  // НАЙТИ ВСЕ КОММЕНТАРИИ ПО АЙДИ ПОСТА
  async readAllByPostId(postId: number): Promise<PostComment[]> {
    return PostComment.findAll({
      where: { post_id: postId },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'name', 'surname', 'avatar_url', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // ОБНОВИТЬ КОММЕНТАРИЙ
  async update(commentId: number, data: UpdatePostCommentData): Promise<PostComment> {
    const comment = await PostComment.findByPk(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    await comment.update(data);

    return PostComment.findByPk(commentId, {
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'name', 'surname', 'avatar_url', 'role'],
        },
      ],
    }) as Promise<PostComment>;
  }

  // УДАЛИТЬ КОММЕНТАРИЙ
  async delete(commentId: number): Promise<void> {
    await PostComment.destroy({
      where: { id: commentId },
    });
  }
}
