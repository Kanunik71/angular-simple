import { SessionType } from '../../models/auth/auth.models';
import { LoginResponseType } from '../../models/auth/auth-response.models';
import { UserRoleEnum } from '../../models/user/user.models';

export class AuthMapper {
  static toSession(response: LoginResponseType): SessionType {
    return {
      username: response.username,
      role: AuthMapper.toRole(response.role),
      token: response.token,
    };
  }

  private static toRole(value: string): UserRoleEnum {
    return value === 'admin' ? 'admin' : 'user';
  }
}
