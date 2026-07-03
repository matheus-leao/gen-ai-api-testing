import { Router } from 'express';
import { requireFields } from '../utils/validation.js';

export function createUserRouter({ userService, config }) {
  const router = Router();

  router.post('/users', async (request, response) => {
    try {
      const missingFieldsMessage = requireFields(request.body, [
        'name',
        'email',
        'password'
      ]);

      if (missingFieldsMessage) {
        response.status(400).json({ error: missingFieldsMessage });
        return;
      }

      const user = await userService.register(request.body);

      response.status(201).json(user);
    } catch (error) {
      response.status(error.statusCode ?? 400).json({ error: error.message });
    }
  });

  router.post('/login', async (request, response) => {
    try {
      const missingFieldsMessage = requireFields(request.body, ['email', 'password']);

      if (missingFieldsMessage) {
        response.status(400).json({ error: missingFieldsMessage });
        return;
      }

      const login = await userService.login({
        ...request.body,
        jwtSecret: config.jwtSecret,
        jwtExpiresInSeconds: config.jwtExpiresInSeconds
      });

      response.status(200).json(login);
    } catch (error) {
      response.status(error.statusCode ?? 400).json({ error: error.message });
    }
  });

  return router;
}
