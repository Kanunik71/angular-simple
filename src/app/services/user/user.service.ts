import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ListPageType, ListQueryType } from '../../models/common/list.models';
import { UserDraftType, UserType } from '../../models/user/user.models';
import { UserFilterType } from '../../models/user/user-filter.models';
import { UsersApi } from '../../core/api/users.api';
import { UserMapper } from './user.mapper';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(UsersApi);

  list(query: ListQueryType<UserFilterType>): Observable<ListPageType<UserType>> {
    return this.api.list(query).pipe(
      map((page) => ({
        items: page.items.map((row) => UserMapper.toUser(row)),
        total: page.total,
      })),
    );
  }

  get(id: string): Observable<UserType> {
    return this.api.get(id).pipe(map((user) => UserMapper.toUser(user)));
  }

  create(draft: UserDraftType): Observable<UserType> {
    return this.api.create(draft).pipe(map((user) => UserMapper.toUser(user)));
  }

  update(id: string, draft: UserDraftType): Observable<UserType> {
    return this.api.update(id, draft).pipe(map((user) => UserMapper.toUser(user)));
  }

  remove(id: string): Observable<void> {
    return this.api.remove(id);
  }
}
