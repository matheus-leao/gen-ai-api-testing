import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createDatabase } from '../src/database/index.js';

const testConfig = {
  jwtSecret: 'test-secret',
  jwtExpiresInSeconds: 3600,
  llm: {
    provider: 'mock'
  }
};

describe('API', () => {
  let api;

  beforeEach(() => {
    const app = createApp({
      config: testConfig,
      db: createDatabase(),
      exerciseGenerator: async () => 'Title: Exercício teste'
    });

    api = request(app);
  });

  it('creates a user, logs in, and creates an exercise with a JWT', async () => {
    // Arrange
    const userPayload = {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    };
    const loginPayload = {
      email: userPayload.email,
      password: userPayload.password
    };
    const exercisePayload = {
      level: 'beginner',
      topics: ['conditions', 'vectors', 'lists', 'loops'],
      context: 'supermercado'
    };

    // Act
    const userResponse = await api
      .post('/users')
      .send(userPayload);
    const user = userResponse.body;

    const loginResponse = await api
      .post('/login')
      .send(loginPayload);
    const login = loginResponse.body;

    const exerciseResponse = await api
      .post('/exercises')
      .set('Authorization', `Bearer ${login.token}`)
      .send(exercisePayload);
    const exercise = exerciseResponse.body;

    // Assert
    assert.equal(userResponse.status, 201);
    assert.equal(user.email, userPayload.email);
    assert.equal(user.passwordHash, undefined);

    assert.equal(loginResponse.status, 200);
    assert.ok(login.token);

    assert.equal(exerciseResponse.status, 201);
    assert.equal(exercise.userId, user.id);
    assert.equal(exercise.content, 'Title: Exercício teste');
  });

  it('blocks exercise creation without a token', async () => {
    // Arrange
    const exercisePayload = { level: 'beginner' };

    // Act
    const response = await api
      .post('/exercises')
      .send(exercisePayload);

    // Assert
    assert.equal(response.status, 401);
  });
});
