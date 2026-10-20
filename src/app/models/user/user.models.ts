import { UserResponseModel } from './user-response.models';

export type UserRoleEnum = 'admin' | 'user';

export interface UserModel extends UserResponseModel {
  role: UserRoleEnum;
  initials: string;
  isAdmin: boolean;
}

export interface UserDraftModel {
  fullName: string;
  email: string;
  role: UserRoleEnum;
}
