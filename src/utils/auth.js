import crypto from 'node:crypto';

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input) {
  const padded = input + '='.repeat((4 - (input.length % 4)) % 4);
  const normalized = padded.replace(/-/g, '+').replace(/_/g, '/');

  return Buffer.from(normalized, 'base64').toString('utf8');
}

function sign(data, secret) {
  return base64UrlEncode(
    crypto.createHmac('sha256', secret).update(data).digest()
  );
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey.toString('hex'));
    });
  });

  return `${salt}:${hash}`;
}

export async function verifyPassword(password, storedPassword) {
  const [salt, hash] = storedPassword.split(':');
  const candidateHash = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey.toString('hex'));
    });
  });

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(candidateHash));
}

export function createJwt(payload, { secret, expiresInSeconds }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token, secret) {
  const [encodedHeader, encodedPayload, receivedSignature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !receivedSignature) {
    throw new Error('Invalid token format');
  }

  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`, secret);

  if (
    !crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(expectedSignature)
    )
  ) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error('Expired token');
  }

  return payload;
}
