import express from 'express';
import { config as defaultConfig } from './config/index.js';
import { createDatabase } from './database/index.js';
import { createAuthMiddleware } from './middlewares/authMiddleware.js';
import { errorMiddleware, notFoundMiddleware } from './middlewares/errorMiddleware.js';
import { createExerciseRouter } from './routes/exerciseRoutes.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { createUserRouter } from './routes/userRoutes.js';
import { createExerciseService } from './services/exerciseService.js';
import { generateExerciseWithLlm } from './services/llmClient.js';
import { createUserService } from './services/userService.js';

export function createApp({
  config = defaultConfig,
  db = createDatabase(),
  exerciseGenerator = generateExerciseWithLlm
} = {}) {
  const app = express();
  const userService = createUserService({ db });
  const exerciseService = createExerciseService({
    db,
    config,
    exerciseGenerator
  });
  const authenticate = createAuthMiddleware({ db, config });

  app.use(express.json({ limit: '1mb' }));
  app.use(createHealthRouter());
  app.use(createUserRouter({ userService, config }));
  app.use(createExerciseRouter({ authenticate, exerciseService }));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
