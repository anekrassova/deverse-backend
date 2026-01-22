import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  username: string;
  name: string;
  surname: string;
  avatar_url?: string | null;
  header_url?: string | null;
  profession: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'avatar_url' | 'header_url' | 'role' | 'created_at' | 'updated_at'
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare email: string;
  declare password: string;
  declare username: string;
  declare name: string;
  declare surname: string;
  declare avatar_url: string | null;
  declare header_url: string | null;
  declare profession: string;
  declare role: UserRole;
  declare created_at: Date;
  declare updated_at: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    surname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    header_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    profession: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: new DataTypes.STRING(50),
      allowNull: false,
      defaultValue: UserRole.User,
    },

    created_at: {
      type: DataTypes.DATE,
    },

    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'user',
    underscored: true,
    timestamps: true,
  },
);
