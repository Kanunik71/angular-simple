import { UserRoleEnum, UserModel } from '../../models/user/user.models';
import { UserResponseModel } from '../../models/user/user-response.models';

export class UserMapper {
  static toUser(response: UserResponseModel): UserModel {
    const role = UserMapper.toRole(response.role);
    return {
      id: response.id,
      fullName: response.fullName,
      email: response.email,
      role,
      initials: UserMapper.toInitials(response.fullName),
      isAdmin: role === 'admin',
    };
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
