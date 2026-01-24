import 'dotenv/config';
import express from 'express';
import { createUserRoutes } from './modules/user';
import { initDatabase } from './config/database.js';
import { setupAssociations } from './shared/associations.js';
import passport from './config/passport.js';
import { errorHandler } from './shared/middleware/handleError';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

(async () => {
  await initDatabase();
  setupAssociations();

  app.use('/user', createUserRoutes());

  app.use(errorHandler);

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
})();
