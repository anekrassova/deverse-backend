import { User } from '../model/user.model.js';

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return User.findOne({ where: { email } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return User.findOne({ where: { username } });
    }

    async create(email: string, username: string, password: string): Promise<User> {
        return User.create({email, username, password});
    }
}