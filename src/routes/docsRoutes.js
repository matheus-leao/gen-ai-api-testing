import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from '../docs/openApiSpec.js';

export function createDocsRouter() {
  const router = Router();

  router.get('/docs.json', (request, response) => {
    response.status(200).json(openApiSpec);
  });

  router.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  return router;
}
