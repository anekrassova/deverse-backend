import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export interface PostCommentAttributes {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

type PostCommentCreationAttributes = Optional<
  PostCommentAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class PostComment
  extends Model<PostCommentAttributes, PostCommentCreationAttributes>
  implements PostCommentAttributes
{
  declare id: number;
  declare post_id: number;
  declare user_id: number;
  declare content: string;
  declare created_at: Date;
  declare updated_at: Date;
}

PostComment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    tableName: 'post_comment',
    underscored: true,
    timestamps: true,
  },
);
