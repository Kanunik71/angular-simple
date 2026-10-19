import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequestType } from '../../models/auth/auth.models';
import { LoginResponseType } from '../../models/auth/auth-response.models';

export interface AuthApiContract {
  login(body: LoginRequestType): Observable<LoginResponseType>;
}

@Injectable({ providedIn: 'root' })
export class AuthApi implements AuthApiContract {
  private readonly http = inject(HttpClient);

  login(body: LoginRequestType): Observable<LoginResponseType> {
    return this.http.post<LoginResponseType>('/api/auth/login', body);
  }
}
