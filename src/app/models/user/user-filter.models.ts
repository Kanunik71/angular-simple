import { UserRoleEnum } from './user.models';

export interface UserFilterType {
  search: string;
  role: UserRoleEnum | '';
}
