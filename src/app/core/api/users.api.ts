import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UserDraftType } from '../../models/user/user.models';
import { UserResponseType } from '../../models/user/user-response.models';

export interface UsersApiContract {
  list(): Observable<UserResponseType[]>;
  create(body: UserDraftType): Observable<UserResponseType>;
  update(id: string, body: UserDraftType): Observable<UserResponseType>;
  remove(id: string): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class UsersApi implements UsersApiContract {
  private readonly http = inject(HttpClient);

  list(): Observable<UserResponseType[]> {
    return this.http.get<UserResponseType[]>('/api/users');
  }

  create(body: UserDraftType): Observable<UserResponseType> {
    return this.http.post<UserResponseType>('/api/users', body);
  }

  update(id: string, body: UserDraftType): Observable<UserResponseType> {
    return this.http.put<UserResponseType>(`/api/users/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
