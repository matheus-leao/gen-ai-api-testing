import { createExercise } from '../models/exercise.js';
import { buildExercisePrompt } from './promptService.js';

const allowedLevels = ['beginner', 'intermediate', 'advanced'];

export function createExerciseService({ db, config, exerciseGenerator }) {
  return {
    async createForUser({ user, level = 'beginner', topics, context }) {
      if (!allowedLevels.includes(level)) {
        const error = new Error('Invalid level. Use beginner, intermediate, or advanced.');
        error.statusCode = 400;
        throw error;
      }

      const prompt = buildExercisePrompt({ level, topics, context });
      const content = await exerciseGenerator(prompt, config.llm);
      const exercise = createExercise({
        userId: user.id,
        level,
        prompt,
        content
      });

      db.exercises.push(exercise);

      return exercise;
    }
  };
}
