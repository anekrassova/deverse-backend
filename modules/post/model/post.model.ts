import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export interface PostAttributes {
  id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

type PostCreationAttributes = Optional<
  PostAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  declare id: number;
  declare user_id: number;
  declare content: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'post',
    underscored: true,
    timestamps: true,
  },
);
