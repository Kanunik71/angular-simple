import { UserRoleEnum } from '../user/user.models';

export interface LoginRequestModel {
  username: string;
  password: string;
}

export interface SessionModel {
  username: string;
  role: UserRoleEnum;
  token: string;
}

export interface JwtPayloadModel {
  sub: string;
  role: UserRoleEnum;
  exp: number;
}
