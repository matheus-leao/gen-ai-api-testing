import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { createAuthenticatedUser, createTestApp } from '../helpers/appHelper.js';

describe('VADER - Verbos', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('aceita GET em /exercises para usuário autenticado', async () => {
    const { token } = await createAuthenticatedUser(api);

    const response = await api.get('/exercises').set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  it('rejeita métodos não suportados em /exercises com 404', async () => {
    const response = await api.delete('/exercises');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: 'Route not found' });
  });
});

describe('VADER - Authorization', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('bloqueia a criação de exercício sem token', async () => {
    const response = await api.post('/exercises').send({ level: 'beginner' });

    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { error: 'Invalid or missing token' });
  });

  it('rejeita token inválido ao listar exercícios', async () => {
    const response = await api.get('/exercises').set('Authorization', 'Bearer invalid-token');

    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { error: 'Invalid or missing token' });
  });

  it('permite acesso com token válido', async () => {
    const { token } = await createAuthenticatedUser(api);

    const response = await api.get('/exercises').set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });
});

describe('VADER - Data', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('cria um exercício com payload válido e estrutura esperada', async () => {
    const { user, token } = await createAuthenticatedUser(api);

    const response = await api.post('/exercises').set('Authorization', `Bearer ${token}`).send({
      level: 'beginner',
      topics: ['conditions', 'loops'],
      context: 'supermercado'
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.userId, user.id);
    assert.equal(response.body.level, 'beginner');
    assert.equal(typeof response.body.id, 'string');
    assert.equal(typeof response.body.prompt, 'string');
    assert.equal(typeof response.body.content, 'string');
    assert.equal(typeof response.body.createdAt, 'string');
  });

  it('rejeita um nível inválido no payload', async () => {
    const { token } = await createAuthenticatedUser(api);

    const response = await api.post('/exercises').set('Authorization', `Bearer ${token}`).send({
      level: 'expert'
    });

    assert.equal(response.status, 400);
    assert.match(response.body.error, /Invalid level/);
  });

  it('aceita um payload mínimo e aplica o default de nível', async () => {
    const { token } = await createAuthenticatedUser(api);

    const response = await api.post('/exercises').set('Authorization', `Bearer ${token}`).send({
      context: 'padaria'
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.level, 'beginner');
    assert.ok(response.body.prompt.length > 0);
  });
});

describe('VADER - Errors', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('retorna 400 para JSON malformado no POST /exercises', async () => {
    const { token } = await createAuthenticatedUser(api);

    const response = await api
      .post('/exercises')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('{invalid json');

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, { error: 'Invalid JSON body' });
  });

  it('retorna 404 para rota inexistente', async () => {
    const response = await api.get('/does-not-exist');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: 'Route not found' });
  });
});

describe('VADER - Responsiveness', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('responde rapidamente ao listar exercícios e mantém o contrato JSON', async () => {
    const { token } = await createAuthenticatedUser(api);

    const startedAt = Date.now();
    const response = await api.get('/exercises').set('Authorization', `Bearer ${token}`);
    const elapsedMs = Date.now() - startedAt;

    assert.equal(response.status, 200);
    assert.equal(response.headers['content-type'].includes('application/json'), true);
    assert.ok(elapsedMs < 1000, `Esperado resposta em menos de 1000ms, recebeu ${elapsedMs}ms`);
    assert.deepEqual(response.body, []);
  });

  it('retorna a lista com a estrutura correta quando há exercícios', async () => {
    const { user, token } = await createAuthenticatedUser(api);

    const createdResponse = await api.post('/exercises').set('Authorization', `Bearer ${token}`).send({
      level: 'beginner',
      context: 'mercado'
    });

    const response = await api.get('/exercises').set('Authorization', `Bearer ${token}`);

    assert.equal(createdResponse.status, 201);
    assert.equal(response.status, 200);
    assert.equal(Array.isArray(response.body), true);
    assert.equal(response.body[0].userId, user.id);
    assert.equal(response.body[0].level, 'beginner');
    assert.equal(typeof response.body[0].createdAt, 'string');
  });
});
