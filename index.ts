import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './config/database.js';
import { setupAssociations } from './shared/associations.js';
import passport from './config/passport.js';
import swaggerUi from 'swagger-ui-express';

import { userRoutes } from './modules/user';
import { postRoutes } from './modules/post';
import { projectRoutes } from './modules/project';
import { aiRoutes } from './modules/ai';

import { errorHandler } from './shared/middleware/handleError';
import { httpLogger, logger } from './shared/logger.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();
app.use(cors());
const port = Number(process.env.PORT) || 3000;
const docsOnly = process.env.DOCS_ONLY === '1';

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

(async () => {
  app.get('/docs.json', (req, res) => res.json(swaggerSpec));
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      swaggerOptions: { persistAuthorization: true },
    }),
  );

  if (!docsOnly) {
    await initDatabase();
    setupAssociations();

    app.use('/user', userRoutes());
    app.use('/post', postRoutes());
    app.use('/project', projectRoutes());
    app.use('/ai', aiRoutes());
  }

  app.use(errorHandler);

  app.listen(port, () => {
    logger.info(
      { port, docsOnly },
      docsOnly ? 'Listening on port (DOCS_ONLY)' : 'Listening on port',
    );
  });
})();
