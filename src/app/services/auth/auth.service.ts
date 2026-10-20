import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { LoginRequestModel, SessionModel } from '../../models/auth/auth.models';
import { AuthApi } from '../../core/api/auth.api';
import { AuthMapper } from './auth.mapper';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);

  login(body: LoginRequestModel): Observable<SessionModel> {
    return this.api.login(body).pipe(map((response) => AuthMapper.toSession(response)));
  }
}
