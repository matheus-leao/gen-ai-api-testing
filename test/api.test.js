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

  it('lists only exercises created by the authenticated user', async () => {
    // Arrange
    const firstUserPayload = {
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    };
    const secondUserPayload = {
      name: 'Bruno',
      email: 'bruno@example.com',
      password: 'secret456'
    };
    const exercisePayload = {
      level: 'beginner',
      topics: ['conditions', 'vectors', 'lists', 'loops'],
      context: 'padaria'
    };

    // Act
    const firstUserResponse = await api
      .post('/users')
      .send(firstUserPayload);
    const firstLoginResponse = await api
      .post('/login')
      .send({
        email: firstUserPayload.email,
        password: firstUserPayload.password
      });

    await api
      .post('/users')
      .send(secondUserPayload);
    const secondLoginResponse = await api
      .post('/login')
      .send({
        email: secondUserPayload.email,
        password: secondUserPayload.password
      });

    const firstExerciseResponse = await api
      .post('/exercises')
      .set('Authorization', `Bearer ${firstLoginResponse.body.token}`)
      .send(exercisePayload);
    await api
      .post('/exercises')
      .set('Authorization', `Bearer ${secondLoginResponse.body.token}`)
      .send(exercisePayload);

    const listResponse = await api
      .get('/exercises')
      .set('Authorization', `Bearer ${firstLoginResponse.body.token}`);

    // Assert
    assert.equal(listResponse.status, 200);
    assert.equal(listResponse.body.length, 1);
    assert.equal(listResponse.body[0].id, firstExerciseResponse.body.id);
    assert.equal(listResponse.body[0].userId, firstUserResponse.body.id);
  });

  it('blocks exercise listing without a token', async () => {
    // Arrange
    const listPath = '/exercises';

    // Act
    const response = await api.get(listPath);

    // Assert
    assert.equal(response.status, 401);
  });

  it('serves the OpenAPI specification and Swagger UI', async () => {
    // Arrange
    const docsJsonPath = '/docs.json';
    const swaggerUiPath = '/docs/';

    // Act
    const docsJsonResponse = await api.get(docsJsonPath);
    const swaggerUiResponse = await api.get(swaggerUiPath);

    // Assert
    assert.equal(docsJsonResponse.status, 200);
    assert.equal(docsJsonResponse.body.openapi, '3.0.3');
    assert.ok(docsJsonResponse.body.paths['/users']);
    assert.ok(docsJsonResponse.body.paths['/login']);
    assert.ok(docsJsonResponse.body.paths['/exercises']);

    assert.equal(swaggerUiResponse.status, 200);
    assert.match(swaggerUiResponse.text, /Swagger UI/);
  });
});
