import { verifyJwt } from '../utils/auth.js';

export function createAuthMiddleware({ db, config }) {
  return function authenticate(request, response, next) {
    try {
      const authorization = request.headers.authorization ?? '';
      const [type, token] = authorization.split(' ');

      if (type !== 'Bearer' || !token) {
        response.status(401).json({ error: 'Invalid or missing token' });
        return;
      }

      const payload = verifyJwt(token, config.jwtSecret);
      const user = db.users.find((candidate) => candidate.id === payload.sub);

      if (!user) {
        response.status(401).json({ error: 'Invalid or missing token' });
        return;
      }

      request.user = user;
      next();
    } catch {
      response.status(401).json({ error: 'Invalid or missing token' });
    }
  };
}
