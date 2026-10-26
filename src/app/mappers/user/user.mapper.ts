import { UserObject } from '../../models/user/user.models';
import { UserResponseModel } from '../../models/user/user-response.models';

export class UserMapper {
  static toUser(response: UserResponseModel): UserObject {
    return new UserObject(
      response.id,
      response.fullName,
      response.email,
      response.role,
      UserMapper.toInitials(response.fullName),
      response.role === 'admin',
    );
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
