import { Like } from '../model/like.model.js';

export interface CreateLikeData {
  user_id: number;
  post_id: number;
}

export class LikeRepository {
  // СОЗДАТЬ ЛАЙК
  async create(data: CreateLikeData): Promise<Like> {
    return Like.create(data);
  }

  // НАЙТИ ЛАЙК ПОЛЬЗОВАТЕЛЯ НА ПОСТЕ
  async readByUserAndPost(userId: number, postId: number): Promise<Like | null> {
    return Like.findOne({
      where: {
        user_id: userId,
        post_id: postId,
      },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });
  }

  // УДАЛИТЬ ЛАЙК ПОЛЬЗОВАТЕЛЯ НА ПОСТЕ
  async deleteByUserAndPost(userId: number, postId: number): Promise<void> {
    await Like.destroy({
      where: {
        user_id: userId,
        post_id: postId,
      },
    });
  }
}
