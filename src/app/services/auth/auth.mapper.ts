import { SessionObject } from '../../models/auth/auth.models';
import { LoginResponseModel } from '../../models/auth/auth-response.models';
import { UserRoleEnum } from '../../models/user/user.models';

export class AuthMapper {
  static toSession(response: LoginResponseModel): SessionObject {
    return new SessionObject(response.username, AuthMapper.toRole(response.role), response.token);
  }

  private static toRole(value: string): UserRoleEnum {
    return value === 'admin' ? 'admin' : 'user';
  }
}
