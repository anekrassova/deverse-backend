import { CustomError } from '../../../shared/errors.js';
import { PostRepository } from '../repository/post.repository';
import { assertOwnershipOrAdmin } from '../../../shared/permissions';
import { User } from '../../user/model/user.model';

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  // СОЗДАТЬ ПОСТ
  async createPost(user_id: number, content: string) {
    return await this.postRepository.create({ user_id, content });
  }

  // ПОЛУЧИТЬ ПОСТ ПО АЙДИ
  async getPostById(postId: number) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    return post;
  }

  // ПОЛУЧИТЬ ВСЕ ПОСТЫ ПОЛЬЗОВАТЕЛЯ
  async getUsersPosts(user_id: number) {
    return this.postRepository.readAllByUserId(user_id);
  }

  // РЕДАКТИРОВАТЬ ПОСТ
  async updatePostContent(postId: number, content: string, requestUser: User) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    assertOwnershipOrAdmin(requestUser, post.user_id);

    return this.postRepository.update(postId, { content });
  }

  // УДАЛИТЬ ПОСТ
  async deletePostById(postId: number, requestUser: User) {
    const post = await this.postRepository.readById(postId);

    if (!post) {
      throw new CustomError(404, 'Post not found');
    }

    assertOwnershipOrAdmin(requestUser, post.user_id);

    await this.postRepository.delete(postId);
  }
}
