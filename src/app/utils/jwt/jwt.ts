import { JwtPayloadModel } from '../../models/auth/auth.models';
import { UserRoleEnum } from '../../models/user/user-role.models';
import { Base64Url } from '../base64/base64-url';

export class Jwt {
  static readPayload(token: string): JwtPayloadModel | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload: unknown = JSON.parse(Base64Url.decode(parts[1]));
      if (!isJwtPayload(payload) || payload.exp * 1000 <= Date.now()) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
}

function isJwtPayload(value: unknown): value is JwtPayloadModel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const payload = value as Partial<JwtPayloadModel>;
  return (
    typeof payload.sub === 'string' &&
    payload.sub.length > 0 &&
    isUserRole(payload.role) &&
    typeof payload.exp === 'number'
  );
}

function isUserRole(value: unknown): value is UserRoleEnum {
  return value === 'admin' || value === 'user';
}
