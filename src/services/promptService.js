export function buildExercisePrompt({ level, topics, context }) {
  const selectedTopics = Array.isArray(topics) && topics.length > 0
    ? topics.join(', ')
    : 'conditions, vectors, lists, and loops';
  const selectedContext = context || 'Supermarket, shopping, bank, coffee shop, etc.';

  return `Goal:

Create an algorithm exercice for a ${level} student.

Topics:

- Only one exercise should be created 1 exercise
- The exercise should have the following concepts: ${selectedTopics}.
- Use common examples on a daily basis to help people to understand the concepts. Example: ${selectedContext}
- The exercise should be created in Portuguese.
- The exercise should have the following structure:
- Title
- Description of the problem
- Goal
- Example of Input data
- Example of Output data

Rules:

- The exercise should be created in Portuguese.
- Don't create the solution, just the problem.
- Don't add hints, just the problem.
- Don't add any other information, just the problem.
- The exercise should have the following structure only:
- Title
- Description of the problem
- Goal
- Example of Input data
- Example of Output data`;
}
