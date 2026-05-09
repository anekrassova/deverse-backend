import { CustomError } from '../../../shared/errors.js';
import { UserRepository } from '../repository/user.repository.js';
import { User } from '../model/user.model.js';
import cloudinary, {
  extractCloudinaryPublicIdFromUrl,
} from '../../../config/cloudinary.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // ПОЛУЧИТЬ ПОЛЬЗОВАТЕЛЯ ПО АЙДИ
  async getUserById(userId: number) {
    const user = await this.userRepository.findPublicById(userId);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    return user;
  }

  // ПОИСК ПОЛЬЗОВАТЕЛЕЙ
  async searchUsers(query: string) {
    if (!query || query.trim().length < 1) {
      throw new CustomError(400, 'Query is required');
    }

    return this.userRepository.search(query);
  }

  // ИЗМЕНЕНИЕ КАРТИНКИ АВАТАРА
  async changeProfileAvatar(requestUser: User, file: Express.Multer.File) {
    if (!file) {
      throw new CustomError(400, 'File does not uploaded.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new CustomError(400, 'Only images allowed');
    }

    const user = await this.userRepository.findById(requestUser.id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const newUrl = (file as any).path as string | undefined;
    if (!newUrl) {
      throw new CustomError(400, 'File does not uploaded.');
    }

    const oldPublicId = user.avatar_url
      ? extractCloudinaryPublicIdFromUrl(user.avatar_url)
      : null;

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'image' });
      } catch {}
    }

    return this.userRepository.update(requestUser.id, { avatar_url: newUrl });
  }

  // ИЗМЕНЕНИЕ КАРТИНКИ HEADER
  async changeProfileHeaderImage(requestUser: User, file: Express.Multer.File) {
    if (!file) {
      throw new CustomError(400, 'File does not uploaded.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new CustomError(400, 'Only images allowed');
    }

    const user = await this.userRepository.findById(requestUser.id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const newUrl = (file as any).path as string | undefined;
    if (!newUrl) {
      throw new CustomError(400, 'File does not uploaded.');
    }

    const oldPublicId = user.header_url
      ? extractCloudinaryPublicIdFromUrl(user.header_url)
      : null;

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'image' });
      } catch {}
    }

    return this.userRepository.update(requestUser.id, { header_url: newUrl });
  }
}
