import { PostComment } from '../model/post_comment.model.js';

export interface CreatePostCommentData {
  post_id: number;
  user_id: number;
  content: string;
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

  // УДАЛИТЬ КОММЕНТАРИЙ
  async delete(commentId: number): Promise<void> {
    await PostComment.destroy({
      where: { id: commentId },
    });
  }
}
