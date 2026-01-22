import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export interface LikeAttributes {
  id: number;
  user_id: number;
  post_id: number;
  created_at: Date;
  updated_at: Date;
}

type LikeCreationAttributes = Optional<
  LikeAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Like
  extends Model<LikeAttributes, LikeCreationAttributes>
  implements LikeAttributes
{
  declare id: number;
  declare user_id: number;
  declare post_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Like.init(
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

    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'like',
    underscored: true,
    timestamps: true,
  },
);
