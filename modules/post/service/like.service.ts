import { CustomError } from '../../../shared/errors.js';
import { User } from '../../user/model/user.model.js';
import { LikeRepository } from '../repository/like.repository.js';

export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  // ПОСТАВИТЬ ЛАЙК НА ПОСТ
  async likePost(postId: number, requestUser: User) {
    const likeExists = await this.likeRepository.readByUserAndPost(
      requestUser.id,
      postId,
    );

    if (likeExists) {
      throw new CustomError(400, 'Like already exists');
    }

    return this.likeRepository.create({
      user_id: requestUser.id,
      post_id: postId,
    });
  }

  // УДАЛИТЬ ЛАЙК С ПОСТА
  async unlikePost(postId: number, requestUser: User) {
    const like = await this.likeRepository.readByUserAndPost(requestUser.id, postId);

    if (!like) {
      throw new CustomError(404, 'Like not found');
    }

    await this.likeRepository.deleteByUserAndPost(requestUser.id, postId);
  }
}
