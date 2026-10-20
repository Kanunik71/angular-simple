import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequestModel } from '../../models/auth/auth.models';
import { LoginResponseModel } from '../../models/auth/auth-response.models';

export interface AuthApiContract {
  login(body: LoginRequestModel): Observable<LoginResponseModel>;
}

@Injectable({ providedIn: 'root' })
export class AuthApi implements AuthApiContract {
  private readonly http = inject(HttpClient);

  login(body: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>('/api/auth/login', body);
  }
}
