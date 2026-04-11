import 'dotenv/config';
import express from 'express';
import { initDatabase } from './config/database.js';
import { setupAssociations } from './shared/associations.js';
import passport from './config/passport.js';
import swaggerUi from 'swagger-ui-express';

import { userRoutes } from './modules/user';
import { postRoutes } from './modules/post';

import { errorHandler } from './shared/middleware/handleError';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

(async () => {
  await initDatabase();
  setupAssociations();

  app.get('/docs.json', (req, res) => res.json(swaggerSpec));
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: { persistAuthorization: true },
    }),
  );

  app.use('/user', userRoutes());
  app.use('/post', postRoutes());

  app.use(errorHandler);

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
})();
