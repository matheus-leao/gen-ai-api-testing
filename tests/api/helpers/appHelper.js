import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../../../src/app.js';
import { createDatabase } from '../../../src/database/index.js';

const testConfig = {
  jwtSecret: 'test-secret',
  jwtExpiresInSeconds: 3600,
  llm: {
    provider: 'mock'
  }
};

export function createTestApp() {
  const app = createApp({
    config: testConfig,
    db: createDatabase(),
    exerciseGenerator: async () => 'Title: Exercício teste'
  });

  return request(app);
}

export async function createAuthenticatedUser(api, overrides = {}) {
  const userPayload = {
    name: overrides.name ?? 'Ana',
    email: overrides.email ?? 'ana@example.com',
    password: overrides.password ?? 'secret123'
  };

  const registerResponse = await api.post('/users').send(userPayload);
  assert.equal(registerResponse.status, 201);

  const loginResponse = await api.post('/login').send({
    email: userPayload.email,
    password: userPayload.password
  });
  assert.equal(loginResponse.status, 200);

  return {
    user: registerResponse.body,
    token: loginResponse.body.token
  };
}
