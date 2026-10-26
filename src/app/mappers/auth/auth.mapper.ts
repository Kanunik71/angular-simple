import { SessionObject } from '../../models/auth/auth.models';
import { LoginResponseModel } from '../../models/auth/auth-response.models';

export class AuthMapper {
  static toSession(response: LoginResponseModel): SessionObject {
    return new SessionObject(response.username, response.role, response.token);
  }
}
