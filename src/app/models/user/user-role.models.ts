import { UserRoleEnum } from './user.models';

export interface UserRoleOptionType {
  value: UserRoleEnum;
  label: string;
}

export const ROLE_OPTIONS: UserRoleOptionType[] = [
  { value: 'user', label: 'roles.user' },
  { value: 'admin', label: 'roles.admin' },
];

const ROLE_LABEL_KEYS: Record<UserRoleEnum, string> = {
  admin: 'roles.admin',
  user: 'roles.user',
};

export function roleLabel(role: UserRoleEnum): string {
  return ROLE_LABEL_KEYS[role];
}
