import bcrypt from 'bcrypt';
import {CustomError} from "../../../shared/errors.js";
import { UserRepository } from '../repository/user.repository.js';
import { signToken } from '../../../config/jwt.js';

export class AuthService {
    constructor(private readonly userRepo: UserRepository) {}

    async register(email: string, username: string, password: string) {
        const existingUser = await this.userRepo.findByEmail(email);
        if (existingUser) {
            throw new CustomError(400, 'User already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const usernameExists = await this.userRepo.findByUsername(username);
        if (usernameExists) {
            throw new CustomError(400, 'Username already in use');
        }

        return this.userRepo.create(email, username, hashedPassword);
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new CustomError(401, 'Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new CustomError(401, 'Invalid credentials');
        }

        const token = signToken({
            userId: user.id,
            role: user.role,
        });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        };
    }
}