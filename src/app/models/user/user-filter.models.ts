import { UserRoleEnum } from './user.models';

export interface UserFilterModel {
  search: string;
  role: UserRoleEnum | '';
}
