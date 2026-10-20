import { HttpBackend, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, map } from 'rxjs';

import { AuthApiMock } from '../api/auth.api.mock';
import { LoginRequestModel } from '../../models/auth/auth.models';
import { UserDraftModel } from '../../models/user/user.models';
import { UsersApiMock } from '../api/users.api.mock';
import { AccessToken } from '../../utils/jwt/access-token';
import { Mock } from '../../utils/mock/mock';

const LOGIN_PATH = '/api/auth/login';
const USERS_PATH = '/api/users';
const USER_PATH = /^\/api\/users\/([^/]+)$/;

@Injectable()
export class MockBackend implements HttpBackend {
  private readonly auth = inject(AuthApiMock);
  private readonly users = inject(UsersApiMock);

  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    return this.dispatch(req).pipe(
      map((body) => new HttpResponse({ body })),
      delay(Mock.latencyMs),
    );
  }

  private dispatch(req: HttpRequest<unknown>): Observable<unknown> {
    const path = pathname(req.url);

    if (!path.startsWith('/api/')) {
      return Mock.fail(404, 'Маршрут не найден');
    }

    if (req.method === 'POST' && path === LOGIN_PATH) {
      return this.auth.login(req.body as LoginRequestModel);
    }

    if (!isAuthorized(req)) {
      return Mock.fail(401, 'Сессия недействительна. Войдите снова.');
    }

    if (req.method === 'GET' && path === USERS_PATH) {
      return this.users.listFromParams(req.params);
    }

    if (req.method === 'POST' && path === USERS_PATH) {
      return this.users.create(req.body as UserDraftModel);
    }

    const userId = path.match(USER_PATH)?.[1];
    if (userId && req.method === 'GET') {
      return this.users.get(userId);
    }

    if (userId && req.method === 'PUT') {
      return this.users.update(userId, req.body as UserDraftModel);
    }

    if (userId && req.method === 'DELETE') {
      return this.users.remove(userId);
    }

    return Mock.fail(404, 'Маршрут не найден');
  }
}

function isAuthorized(req: HttpRequest<unknown>): boolean {
  const header = req.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return false;
  }
  return AccessToken.verify(header.slice('Bearer '.length)) !== null;
}

function pathname(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return new URL(url).pathname;
  }
  return url.split('?')[0];
}
