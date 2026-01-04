import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  },
);

export const initDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Database connection failed.', error);
    throw error;
  }
};
