import { UserResponseModel } from './user-response.models';
import { UserRoleEnum } from './user-role.models';

export class UserObject implements UserResponseModel {
  constructor(
    readonly id: string,
    readonly fullName: string,
    readonly email: string,
    readonly role: UserRoleEnum,
    readonly initials: string,
    readonly isAdmin: boolean,
  ) {}
}

export interface UserDraftModel {
  fullName: string;
  email: string;
  role: UserRoleEnum;
}
