import { UserRoleEnum } from '../user/user-role.models';

export interface LoginResponseModel {
  token: string;
  username: string;
  role: UserRoleEnum;
}
