import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { LoginRequestModel, SessionObject } from '../../models/auth/auth.models';
import { AuthApi } from '../../core/api/auth.api';
import { AuthMapper } from './auth.mapper';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);

  login(body: LoginRequestModel): Observable<SessionObject> {
    return this.api.login(body).pipe(map((response) => AuthMapper.toSession(response)));
  }
}
