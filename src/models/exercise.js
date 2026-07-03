import crypto from 'node:crypto';

export function createExercise({ userId, level, prompt, content }) {
  return {
    id: crypto.randomUUID(),
    userId,
    level,
    prompt,
    content,
    createdAt: new Date().toISOString()
  };
}
