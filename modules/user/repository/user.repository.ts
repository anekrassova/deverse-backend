import { User } from '../model/user.model.js';

export interface CreateUserData {
  name: string;
  surname: string;
  username: string;
  profession: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  avatar_url?: string | null;
  header_url?: string | null;
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

  // НАЙТИ ПОЛЬЗОВАТЕЛЯ ПО АЙДИ
  async findById(id: number): Promise<User | null> {
    return User.findOne({ where: { id } });
  }

  // СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ
  async create(data: CreateUserData): Promise<User> {
    return User.create(data);
  }

  // ОБНОВИТЬ ПОЛЬЗОВАТЕЛЯ
  async update(userId: number, data: UpdateUserData): Promise<User> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.update(data);

    return User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ['password', 'created_at', 'updated_at'],
      },
    }) as Promise<User>;
  }
}
