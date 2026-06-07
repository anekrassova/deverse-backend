import { CustomError } from '../../../shared/errors.js';
import { UserRepository, UpdateUserData } from '../repository/user.repository.js';
import { User } from '../model/user.model.js';
import cloudinary, {
  extractCloudinaryPublicIdFromUrl,
} from '../../../config/cloudinary.js';
import bcrypt from 'bcrypt';
import { logger } from '../../../shared/logger.js';

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

  // РЕДАКТИРОВАНИЕ ПРОФИЛЯ
  async updateProfile(requestUser: User, data: UpdateUserData) {
    const user = await this.userRepository.findById(requestUser.id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    if (data.username && data.username !== user.username) {
      const usernameExists = await this.userRepository.findByUsername(data.username);
      if (usernameExists && usernameExists.id !== requestUser.id) {
        throw new CustomError(400, 'Username already in use');
      }
    }

    return this.userRepository.update(requestUser.id, data);
  }

  // СМЕНА ПАРОЛЯ
  async changePassword(requestUser: User, password: string) {
    const user = await this.userRepository.findById(requestUser.id);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.update(requestUser.id, { password: hashedPassword });
  }

  // АДМИНСКАЯ СМЕНА ПАРОЛЯ ПО ЭМЕЙЛУ
  async changePasswordByEmail(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.update(user.id, { password: hashedPassword });
  }

  // ИЗМЕНЕНИЕ КАРТИНКИ АВАТАРА
  async changeProfileAvatar(requestUser: User, file: Express.Multer.File) {
    logger.debug({
      msg: '[changeProfileAvatar] service input',
      requestUserId: requestUser?.id,
      file: file
        ? {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: (file as any).path,
            filename: (file as any).filename,
          }
        : null,
    });

    if (!file) {
      logger.debug({ msg: '[changeProfileAvatar] rejected: req.file is empty' });
      throw new CustomError(400, 'File does not uploaded.');
    }

    if (!file.mimetype.startsWith('image/')) {
      logger.debug({
        msg: '[changeProfileAvatar] rejected: mimetype is not image/*',
        mimetype: file.mimetype,
      });
      throw new CustomError(400, 'Only images allowed');
    }

    const user = await this.userRepository.findById(requestUser.id);
    if (!user) {
      logger.debug({
        msg: '[changeProfileAvatar] rejected: user not found',
        requestUserId: requestUser.id,
      });
      throw new CustomError(404, 'User not found');
    }

    const newUrl = (file as any).path as string | undefined;
    if (!newUrl) {
      logger.debug({
        msg: '[changeProfileAvatar] rejected: uploaded file has no path',
        file: file
          ? {
              fieldname: file.fieldname,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              path: (file as any).path,
              filename: (file as any).filename,
            }
          : null,
      });
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

    logger.debug({
      msg: '[changeProfileAvatar] updating user avatar',
      requestUserId: requestUser.id,
      oldAvatarUrl: user.avatar_url,
      newAvatarUrl: newUrl,
      oldPublicId,
    });

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
