import { UserRoleEnum } from './user-role.models';

export interface UserResponseModel {
  id: string;
  fullName: string;
  email: string;
  role: UserRoleEnum;
}
