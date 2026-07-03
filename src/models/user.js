import crypto from 'node:crypto';

export function createUser({ name, email, passwordHash }) {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };
}

export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}
