import { UserRoleEnum } from './user.models';

export interface UserRoleOptionType {
  value: UserRoleEnum;
  label: string;
}

export interface UserRoleFilterOptionType {
  value: UserRoleEnum | '';
  label: string;
}

export const ROLE_OPTIONS: UserRoleOptionType[] = [
  { value: 'user', label: 'roles.user' },
  { value: 'admin', label: 'roles.admin' },
];

export const USER_ROLE_FILTER_OPTIONS: UserRoleFilterOptionType[] = [
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
