import 'dotenv/config';
import express from 'express';
import { createUserRoutes } from './modules/user';
import { initDatabase } from './config/database.js';
import { setupAssociations } from './shared/associations.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await initDatabase();
  setupAssociations();

  app.use('/user', createUserRoutes());

  // todo: написать error-handling middleware и сюда его подключить

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
})();
