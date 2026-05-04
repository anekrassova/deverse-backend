import { CustomError } from '../../../shared/errors.js';
import { UserRepository } from '../repository/user.repository.js';
import { User } from '../model/user.model.js';
import {
  buildPublicObjectUrl,
  extractObjectKeyFromPublicUrl,
  minioBucket,
  minioClient,
} from '../../../config/minio.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

    const ext = file.mimetype.split('/')[1] || 'png';
    const objectKey = `users/${requestUser.id}/avatar-${Date.now()}.${ext}`;

    await minioClient.putObject(minioBucket, objectKey, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const oldKey = user.avatar_url
      ? extractObjectKeyFromPublicUrl(user.avatar_url)
      : null;

    if (oldKey) {
      try {
        await minioClient.removeObject(minioBucket, oldKey);
      } catch {}
    }

    const publicUrl = buildPublicObjectUrl(objectKey);

    return this.userRepository.update(requestUser.id, { avatar_url: publicUrl });
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

    const ext = file.mimetype.split('/')[1] || 'png';
    const objectKey = `users/${requestUser.id}/header-${Date.now()}.${ext}`;

    await minioClient.putObject(minioBucket, objectKey, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const oldKey = user.header_url
      ? extractObjectKeyFromPublicUrl(user.header_url)
      : null;

    if (oldKey) {
      try {
        await minioClient.removeObject(minioBucket, oldKey);
      } catch {}
    }

    const publicUrl = buildPublicObjectUrl(objectKey);

    return this.userRepository.update(requestUser.id, { header_url: publicUrl });
  }
}
