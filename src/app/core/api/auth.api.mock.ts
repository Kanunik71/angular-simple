import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LoginRequestType } from '../../models/auth/auth.models';
import { LoginResponseType } from '../../models/auth/auth-response.models';
import { AccessToken } from '../../utils/jwt/access-token';
import { Mock } from '../../utils/mock/mock';
import { AuthApiContract } from './auth.api';

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin';
const DEMO_ROLE = 'admin';

@Injectable({ providedIn: 'root' })
export class AuthApiMock implements AuthApiContract {
  login(body: LoginRequestType): Observable<LoginResponseType> {
    const source = Mock.record(body);
    const username = Mock.text(source, 'username');
    const password = Mock.text(source, 'password');

    if (!username || !password) {
      return Mock.fail(400, 'Введите логин и пароль');
    }

    if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      return Mock.fail(401, 'Неверный логин или пароль');
    }

    const token = AccessToken.create({ sub: username, role: DEMO_ROLE });
    return of({ token, username, role: DEMO_ROLE });
  }
}
