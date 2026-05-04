import { Follower } from '../model/follower.model.js';
import { User } from '../model/user.model.js';

export class FollowerRepository {
  // СОЗДАТЬ ПОДПИСКУ
  async create(follower_id: number, following_id: number): Promise<Follower> {
    return Follower.create({ follower_id, following_id });
  }

  // НАЙТИ ПОДПИСКУ
  async readByFollowerAndFollowing(
    followerId: number,
    followingId: number,
  ): Promise<Follower | null> {
    return Follower.findOne({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
      attributes: {
        exclude: ['created_at', 'updated_at'],
      },
    });
  }

  // УДАЛИТЬ ПОДПИСКУ
  async deleteByFollowerAndFollowing(
    followerId: number,
    followingId: number,
  ): Promise<void> {
    await Follower.destroy({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  }

  // ПОЛУЧИТЬ ПОДПИСЧИКОВ ПОЛЬЗОВАТЕЛЯ
  async readFollowersUsersByUserId(userId: number): Promise<User[]> {
    return User.findAll({
      attributes: ['id', 'username', 'name', 'surname', 'avatar_url', 'role'],
      include: [
        {
          model: Follower,
          as: 'followingRelations',
          where: { following_id: userId },
          attributes: [],
        },
      ],
      order: [[{ model: Follower, as: 'followingRelations' }, 'created_at', 'DESC']],
    });
  }

  // ПОЛУЧИТЬ ПОДПИСКИ ПОЛЬЗОВАТЕЛЯ
  async readFollowingUsersByUserId(userId: number): Promise<User[]> {
    return User.findAll({
      attributes: ['id', 'username', 'name', 'surname', 'avatar_url', 'role'],
      include: [
        {
          model: Follower,
          as: 'followerRelations',
          where: { follower_id: userId },
          attributes: [],
        },
      ],
      order: [[{ model: Follower, as: 'followerRelations' }, 'created_at', 'DESC']],
    });
  }
}
