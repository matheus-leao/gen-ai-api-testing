import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { createTestApp } from '../helpers/appHelper.js';

describe('VADER - Verbos (Users)', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('aceita POST em /users para criar usuário', async () => {
    const response = await api.post('/users').send({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.email, 'ana@example.com');
    assert.ok(response.body.id);
  });

  it('rejeita métodos não suportados em /users com 404', async () => {
    const response = await api.get('/users');

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { error: 'Route not found' });
  });
});

describe('VADER - Authorization (Users)', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('permite login com credenciais válidas', async () => {
    await api.post('/users').send({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    });

    const response = await api.post('/login').send({
      email: 'ana@example.com',
      password: 'secret123'
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.tokenType, 'Bearer');
    assert.ok(response.body.token);
  });

  it('rejeita login com senha incorreta', async () => {
    await api.post('/users').send({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    });

    const response = await api.post('/login').send({
      email: 'ana@example.com',
      password: 'wrong-password'
    });

    assert.equal(response.status, 401);
    assert.deepEqual(response.body, { error: 'Invalid email or password' });
  });
});

describe('VADER - Data (Users)', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('cria usuário com payload válido e normaliza o e-mail', async () => {
    const response = await api.post('/users').send({
      name: 'Ana',
      email: ' ANA@Example.com ',
      password: 'secret123'
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.email, 'ana@example.com');
    assert.equal(typeof response.body.createdAt, 'string');
  });

  it('rejeita cadastro sem campos obrigatórios', async () => {
    const response = await api.post('/users').send({
      name: 'Ana'
    });

    assert.equal(response.status, 400);
    assert.match(response.body.error, /Missing required fields/);
  });

  it('rejeita cadastro duplicado para o mesmo e-mail', async () => {
    await api.post('/users').send({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    });

    const response = await api.post('/users').send({
      name: 'Ana',
      email: 'ANA@example.com',
      password: 'secret123'
    });

    assert.equal(response.status, 409);
    assert.deepEqual(response.body, { error: 'User already exists' });
  });
});

describe('VADER - Errors (Users)', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('retorna 400 para JSON malformado em /users', async () => {
    const response = await api
      .post('/users')
      .set('Content-Type', 'application/json')
      .send('{invalid json');

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, { error: 'Invalid JSON body' });
  });

  it('retorna 400 para login sem payload obrigatório', async () => {
    const response = await api.post('/login').send({ email: 'ana@example.com' });

    assert.equal(response.status, 400);
    assert.match(response.body.error, /Missing required fields/);
  });
});

describe('VADER - Responsiveness (Users)', () => {
  let api;

  beforeEach(() => {
    api = createTestApp();
  });

  it('responde rapidamente ao criar usuário e mantém o contrato JSON', async () => {
    const startedAt = Date.now();
    const response = await api.post('/users').send({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'secret123'
    });
    const elapsedMs = Date.now() - startedAt;

    assert.equal(response.status, 201);
    assert.equal(response.headers['content-type'].includes('application/json'), true);
    assert.ok(elapsedMs < 1000, `Esperado resposta em menos de 1000ms, recebeu ${elapsedMs}ms`);
    assert.equal(typeof response.body.id, 'string');
  });
});
