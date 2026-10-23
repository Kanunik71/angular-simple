import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LoginRequestModel } from '../../models/auth/auth.models';
import { LoginResponseModel } from '../../models/auth/auth-response.models';
import { AccessToken } from '../../utils/jwt/access-token';
import { Mock } from '../../utils/mock/mock';
import { AuthApiContract } from './auth.api';

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin';
const DEMO_ROLE = 'admin';

@Injectable({ providedIn: 'root' })
export class AuthApiMock implements AuthApiContract {
  login(body: LoginRequestModel): Observable<LoginResponseModel> {
    const source = Mock.record(body);
    const username = Mock.text(source, 'username');
    const password = Mock.text(source, 'password');

    if (!username || !password) {
      return Mock.fail(400, 'apiErrors.loginRequired');
    }

    if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      return Mock.fail(401, 'apiErrors.invalidCredentials');
    }

    const token = AccessToken.create({ sub: username, role: DEMO_ROLE });
    return of({ token, username, role: DEMO_ROLE });
  }
}
