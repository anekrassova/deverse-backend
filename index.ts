import 'dotenv/config';
import express from 'express';
import { createUserRoutes } from './modules/user/index.js';
import { initDatabase } from './config/database.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await initDatabase();

  app.use('/user', createUserRoutes());

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
})();

