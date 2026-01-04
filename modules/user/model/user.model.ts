import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
    role: 'USER' | 'ADMIN';
    created_at: Date;
    updated_at: Date;
}

type UserCreationAttributes = Optional<
    UserAttributes,
    'id' | 'avatar_url' | 'bio' | 'role' | 'created_at' | 'updated_at'
>;

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    declare id: number;
    declare email: string;
    declare password: string;
    declare username: string;
    declare avatar_url: string | null;
    declare bio: string | null;
    declare role: 'USER' | 'ADMIN';
    declare created_at: Date;
    declare updated_at: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        avatar_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('USER', 'ADMIN'),
            allowNull: false,
            defaultValue: 'USER'
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    },
    {
        sequelize,
        tableName: 'user',
        underscored: true,
        timestamps: true
    }
);
