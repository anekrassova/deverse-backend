import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/database.js';

export interface ProjectApplicationAttributes {
  id: number;
  project_id: number;
  user_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

type ProjectApplicationCreationAttributes = Optional<
  ProjectApplicationAttributes,
  'id' | 'status' | 'created_at' | 'updated_at'
>;

export class ProjectApplication
  extends Model<ProjectApplicationAttributes, ProjectApplicationCreationAttributes>
  implements ProjectApplicationAttributes
{
  declare id: number;
  declare project_id: number;
  declare user_id: number;
  declare status: string;
  declare created_at: Date;
  declare updated_at: Date;
}

ProjectApplication.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    project_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pending',
    },

    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'project_application',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['project_id', 'user_id'],
      },
    ],
  },
);
