import { User } from '../model/user.model.js';

export interface CreateUserData {
  name: string;
  surname: string;
  username: string;
  profession: string;
  email: string;
  password: string;
}

export class UserRepository {
  // НАЙТИ ПОЛЬЗОВАТЕЛЯ ПО ЭМЕЙЛ
  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  // НАЙТИ ПОЛЬЗОВАТЕЛЯ ПО НИКУ
  async findByUsername(username: string): Promise<User | null> {
    return User.findOne({ where: { username } });
  }

  // СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ
  async create(data: CreateUserData): Promise<User> {
    return User.create(data);
  }
}
