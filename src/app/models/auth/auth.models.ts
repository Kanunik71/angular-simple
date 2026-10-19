import { UserRoleEnum } from '../user/user.models';

export interface LoginRequestType {
  username: string;
  password: string;
}

export interface SessionType {
  username: string;
  role: UserRoleEnum;
  token: string;
}

export interface JwtPayloadType {
  sub: string;
  role: UserRoleEnum;
  exp: number;
}
