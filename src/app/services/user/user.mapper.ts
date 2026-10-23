import { UserRoleEnum, UserObject } from '../../models/user/user.models';
import { UserResponseModel } from '../../models/user/user-response.models';

export class UserMapper {
  static toUser(response: UserResponseModel): UserObject {
    const role = UserMapper.toRole(response.role);
    return new UserObject(
      response.id,
      response.fullName,
      response.email,
      role,
      UserMapper.toInitials(response.fullName),
      role === 'admin',
    );
  }

  private static toRole(value: string): UserRoleEnum {
    return value === 'admin' ? 'admin' : 'user';
  }

  private static toInitials(fullName: string): string {
    return fullName
      .split(/\s+/)
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
