import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ListPageModel, ListQueryModel } from '../../models/common/list.models';
import { UserDraftModel } from '../../models/user/user.models';
import { UserFilterModel } from '../../models/user/user-filter.models';
import { UserResponseModel } from '../../models/user/user-response.models';

export interface UsersApiContract {
  list(query: ListQueryModel<UserFilterModel>): Observable<ListPageModel<UserResponseModel>>;
  get(id: string): Observable<UserResponseModel>;
  create(body: UserDraftModel): Observable<UserResponseModel>;
  update(id: string, body: UserDraftModel): Observable<UserResponseModel>;
  remove(id: string): Observable<void>;
}

@Injectable({ providedIn: 'root' })
export class UsersApi implements UsersApiContract {
  private readonly http = inject(HttpClient);

  list(query: ListQueryModel<UserFilterModel>): Observable<ListPageModel<UserResponseModel>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    if (query.filters.search) {
      params = params.set('search', query.filters.search);
    }
    if (query.filters.role) {
      params = params.set('role', query.filters.role);
    }
    return this.http.get<ListPageModel<UserResponseModel>>('/api/users', { params });
  }

  get(id: string): Observable<UserResponseModel> {
    return this.http.get<UserResponseModel>(`/api/users/${id}`);
  }

  create(body: UserDraftModel): Observable<UserResponseModel> {
    return this.http.post<UserResponseModel>('/api/users', body);
  }

  update(id: string, body: UserDraftModel): Observable<UserResponseModel> {
    return this.http.put<UserResponseModel>(`/api/users/${id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
