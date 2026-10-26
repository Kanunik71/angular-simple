import { UserRoleEnum } from './user-role.models';

export interface UserFilterModel {
  search: string;
  role: UserRoleEnum | '';
}

export const DEFAULT_USER_FILTER: UserFilterModel = {
  search: '',
  role: '',
};
