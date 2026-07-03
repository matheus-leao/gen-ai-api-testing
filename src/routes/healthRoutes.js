import { Router } from 'express';

export function createHealthRouter() {
  const router = Router();

  router.get('/health', (request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  return router;
}
