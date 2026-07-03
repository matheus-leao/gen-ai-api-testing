import { Router } from 'express';

export function createExerciseRouter({ authenticate, exerciseService }) {
  const router = Router();

  router.post('/exercises', authenticate, async (request, response) => {
    try {
      const exercise = await exerciseService.createForUser({
        user: request.user,
        level: request.body.level,
        topics: request.body.topics,
        context: request.body.context
      });

      response.status(201).json(exercise);
    } catch (error) {
      response.status(error.statusCode ?? 502).json({ error: error.message });
    }
  });

  return router;
}
