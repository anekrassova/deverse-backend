import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export interface FollowerAttributes {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: Date;
  updated_at: Date;
}

type FollowerCreationAttributes = Optional<
  FollowerAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Follower
  extends Model<FollowerAttributes, FollowerCreationAttributes>
  implements FollowerAttributes
{
  declare id: number;
  declare follower_id: number;
  declare following_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

Follower.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    follower_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    following_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    tableName: 'follower',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id'],
      },
    ],
  },
);
