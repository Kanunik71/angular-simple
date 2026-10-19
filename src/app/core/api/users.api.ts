import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ListPageType, ListQueryType } from '../../models/common/list.models';
import { UserDraftType } from '../../models/user/user.models';
import { UserFilterType } from '../../models/user/user-filter.models';
import { UserResponseType } from '../../models/user/user-response.models';

export interface UsersApiContract {
  list(query: ListQueryType<UserFilterType>): Observable<ListPageType<UserResponseType>>;
  get(id: string): Observable<UserResponseType>;
  create(body: UserDraftType): Observable<UserResponseType>;
  update(id: string, body: UserDraftType): Observable<UserResponseType>;
  remove(id: string): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class UsersApi implements UsersApiContract {
  private readonly http = inject(HttpClient);

  list(query: ListQueryType<UserFilterType>): Observable<ListPageType<UserResponseType>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    if (query.filters.search) {
      params = params.set('search', query.filters.search);
    }
    if (query.filters.role) {
      params = params.set('role', query.filters.role);
    }
    return this.http.get<ListPageType<UserResponseType>>('/api/users', { params });
  }

  get(id: string): Observable<UserResponseType> {
    return this.http.get<UserResponseType>(`/api/users/${id}`);
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
