import { SessionModel } from '../../models/auth/auth.models';
import { LoginResponseModel } from '../../models/auth/auth-response.models';
import { UserRoleEnum } from '../../models/user/user.models';

export class AuthMapper {
  static toSession(response: LoginResponseModel): SessionModel {
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
