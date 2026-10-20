import { UserRoleEnum } from './user.models';

export interface UserRoleOptionModel {
  value: UserRoleEnum;
  label: string;
}

export interface UserRoleFilterOptionModel {
  value: UserRoleEnum | '';
  label: string;
}

export const ROLE_OPTIONS: UserRoleOptionModel[] = [
  { value: 'user', label: 'roles.user' },
  { value: 'admin', label: 'roles.admin' },
];

export const USER_ROLE_FILTER_OPTIONS: UserRoleFilterOptionModel[] = [
  { value: '', label: 'users.allRoles' },
  ...ROLE_OPTIONS,
];

const ROLE_LABEL_KEYS: Record<UserRoleEnum, string> = {
  admin: 'roles.admin',
  user: 'roles.user',
};

export function roleLabel(role: UserRoleEnum): string {
  return ROLE_LABEL_KEYS[role];
}
