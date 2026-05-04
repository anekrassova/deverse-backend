import { CustomError } from '../../../shared/errors.js';
import { User, UserRole } from '../model/user.model.js';
import { FollowerRepository } from '../repository/follower.repository.js';
import { UserRepository } from '../repository/user.repository.js';

export class FollowerService {
  constructor(
    private readonly followerRepository: FollowerRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // ПОДПИСАТЬСЯ НА ПОЛЬЗОВАТЕЛЯ
  async followUser(targetUserId: number, requestUser: User) {
    if (requestUser.role !== UserRole.User) {
      throw new CustomError(403, 'Forbidden');
    }

    if (requestUser.id === targetUserId) {
      throw new CustomError(400, 'You cannot follow yourself');
    }

    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) {
      throw new CustomError(404, 'User not found');
    }

    const subscriptionExists = await this.followerRepository.readByFollowerAndFollowing(
      requestUser.id,
      targetUserId,
    );

    if (subscriptionExists) {
      throw new CustomError(400, 'Already following');
    }

    return this.followerRepository.create(requestUser.id, targetUserId);
  }

  // ОТПИСАТЬСЯ ОТ ПОЛЬЗОВАТЕЛЯ
  async unfollowUser(targetUserId: number, requestUser: User) {
    if (requestUser.role !== UserRole.User) {
      throw new CustomError(403, 'Forbidden');
    }

    const subscription = await this.followerRepository.readByFollowerAndFollowing(
      requestUser.id,
      targetUserId,
    );

    if (!subscription) {
      throw new CustomError(404, 'Subscription not found');
    }

    await this.followerRepository.deleteByFollowerAndFollowing(
      requestUser.id,
      targetUserId,
    );
  }

  // ПОЛУЧИТЬ ПОДПИСЧИКОВ ПОЛЬЗОВАТЕЛЯ
  async getFollowers(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    return this.followerRepository.readFollowersUsersByUserId(userId);
  }

  // ПОЛУЧИТЬ ПОДПИСКИ ПОЛЬЗОВАТЕЛЯ
  async getFollowing(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    return this.followerRepository.readFollowingUsersByUserId(userId);
  }
}
