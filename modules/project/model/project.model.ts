import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export interface ProjectAttributes {
  id: number;
  user_id: number;
  title: string;
  description: string;
  url: string;
  created_at: Date;
  updated_at: Date;
}

type ProjectCreationAttributes = Optional<
  ProjectAttributes,
  'id' | 'created_at' | 'updated_at'
>;

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  declare id: number;
  declare user_id: number;
  declare title: string;
  declare description: string;
  declare url: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Project.init(
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

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'projects',
    underscored: true,
    timestamps: true,
  },
);
