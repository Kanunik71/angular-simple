import { UserRoleEnum } from './user.models';

export interface UserRoleOptionModel {
  value: UserRoleEnum;
  labelKey: string;
}

export interface UserRoleFilterOptionModel {
  value: UserRoleEnum | '';
  labelKey: string;
}

export const ROLE_OPTIONS: UserRoleOptionModel[] = [
  { value: 'user', labelKey: 'roles.user' },
  { value: 'admin', labelKey: 'roles.admin' },
];

export const USER_ROLE_FILTER_OPTIONS: UserRoleFilterOptionModel[] = [
  { value: '', labelKey: 'users.allRoles' },
  ...ROLE_OPTIONS,
];

const ROLE_LABEL_KEYS: Record<UserRoleEnum, string> = {
  admin: 'roles.admin',
  user: 'roles.user',
};

export function roleLabelKey(role: UserRoleEnum): string {
  return ROLE_LABEL_KEYS[role];
}
