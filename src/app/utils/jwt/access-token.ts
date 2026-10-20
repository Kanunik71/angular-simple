import { JwtPayloadModel } from '../../models/auth/auth.models';
import { Base64Url } from '../base64/base64-url';

const SECRET = 'exam-demo-secret';
const TOKEN_TTL_SECONDS = 8 * 60 * 60;

export class AccessToken {
  static create(payload: Omit<JwtPayloadModel, 'exp'>): string {
    const header = Base64Url.encode(JSON.stringify({ alg: 'demo', typ: 'JWT' }));
    const body = Base64Url.encode(
      JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
      }),
    );
    return `${header}.${body}.${sign(`${header}.${body}`)}`;
  }

  static verify(token: string): JwtPayloadModel | null {
    const parts = token.split('.');
    if (parts.length !== 3 || sign(`${parts[0]}.${parts[1]}`) !== parts[2]) {
      return null;
    }

    try {
      const payload: unknown = JSON.parse(Base64Url.decode(parts[1]));
      if (!isPayload(payload) || payload.exp * 1000 <= Date.now()) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
}

function sign(value: string): string {
  let hash = 2166136261;
  const input = `${value}.${SECRET}`;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function isPayload(value: unknown): value is JwtPayloadModel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const payload = value as Partial<JwtPayloadModel>;
  return (
    typeof payload.sub === 'string' &&
    (payload.role === 'admin' || payload.role === 'user') &&
    typeof payload.exp === 'number'
  );
}
