import { UserRoleEnum } from '../user/user.models';

export interface LoginRequestModel {
  username: string;
  password: string;
}

export class SessionObject {
  constructor(
    readonly username: string,
    readonly role: UserRoleEnum,
    readonly token: string,
  ) {}
}

export interface JwtPayloadModel {
  sub: string;
  role: UserRoleEnum;
  exp: number;
}
