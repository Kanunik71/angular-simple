import { UserResponseType } from './user-response.models';

export type UserRoleEnum = 'admin' | 'user';

export interface UserType extends UserResponseType {
  role: UserRoleEnum;
  initials: string;
  isAdmin: boolean;
}

export interface UserDraftType {
  fullName: string;
  email: string;
  role: UserRoleEnum;
}
