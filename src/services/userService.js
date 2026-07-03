import { createUser, toPublicUser } from '../models/user.js';
import { createJwt, hashPassword, verifyPassword } from '../utils/auth.js';

export function createUserService({ db }) {
  return {
    async register({ name, email, password }) {
      const normalizedEmail = email.toLowerCase().trim();
      const userAlreadyExists = db.users.some((user) => user.email === normalizedEmail);

      if (userAlreadyExists) {
        const error = new Error('User already exists');
        error.statusCode = 409;
        throw error;
      }

      const user = createUser({
        name,
        email: normalizedEmail,
        passwordHash: await hashPassword(password)
      });

      db.users.push(user);

      return toPublicUser(user);
    },

    async login({ email, password, jwtSecret, jwtExpiresInSeconds }) {
      const normalizedEmail = email.toLowerCase().trim();
      const user = db.users.find((candidate) => candidate.email === normalizedEmail);

      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
      }

      return {
        token: createJwt(
          { sub: user.id, email: user.email },
          {
            secret: jwtSecret,
            expiresInSeconds: jwtExpiresInSeconds
          }
        ),
        tokenType: 'Bearer',
        expiresInSeconds: jwtExpiresInSeconds
      };
    }
  };
}
