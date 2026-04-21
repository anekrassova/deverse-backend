import { CustomError } from '../../../shared/errors.js';
import { UserRepository } from '../repository/user.repository.js';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // todo ИЗМЕНЕИЕ КАРТИНКИ АВАТАРА
  async changeProfileAvatar() {}

  // todo ИЗМЕНЕНИЕ КАРТИНКИ HEADER
  async changeProfileHeaderImage() {}
}
