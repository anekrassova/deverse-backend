import { CustomError } from '../../../shared/errors.js';
import { assertOwnershipOrAdmin } from '../../../shared/permissions.js';
import { User } from '../../user/model/user.model.js';
import { PostCommentRepository } from '../repository/post_comment.repository.js';

export class CommentService {
  constructor(private readonly postCommentRepository: PostCommentRepository) {}

  // СОЗДАТЬ КОММЕНТАРИЙ
  async createComment(user_id: number, post_id: number, content: string) {
    return this.postCommentRepository.create({ user_id, post_id, content });
  }

  // УДАЛИТЬ КОММЕНТАРИЙ
  async deleteCommentById(commentId: number, requestUser: User) {
    const comment = await this.postCommentRepository.readById(commentId);

    if (!comment) {
      throw new CustomError(404, 'Comment not found');
    }

    assertOwnershipOrAdmin(requestUser, comment.user_id);

    await this.postCommentRepository.delete(commentId);
  }

  // РЕДАКТИРОВАТЬ КОММЕНТАРИЙ
  async updateCommentContent(commentId: number, content: string, requestUser: User) {
    const comment = await this.postCommentRepository.readById(commentId);

    if (!comment) {
      throw new CustomError(404, 'Comment not found');
    }

    assertOwnershipOrAdmin(requestUser, comment.user_id);

    return this.postCommentRepository.update(commentId, { content });
  }
}
