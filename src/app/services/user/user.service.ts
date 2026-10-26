import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ListPageModel, ListQueryModel } from '../../models/common/list.models';
import { UserDraftModel, UserObject } from '../../models/user/user.models';
import { UserFilterModel } from '../../models/user/user-filter.models';
import { UsersApi } from '../../core/api/users.api';
import { UserMapper } from '../../mappers/user/user.mapper';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(UsersApi);

  list(query: ListQueryModel<UserFilterModel>): Observable<ListPageModel<UserObject>> {
    return this.api.list(query).pipe(
      map((page) => ({
        items: page.items.map((row) => UserMapper.toUser(row)),
        total: page.total,
      })),
    );
  }

  get(id: string): Observable<UserObject> {
    return this.api.get(id).pipe(map((user) => UserMapper.toUser(user)));
  }

  create(draft: UserDraftModel): Observable<UserObject> {
    return this.api.create(draft).pipe(map((user) => UserMapper.toUser(user)));
  }

  update(id: string, draft: UserDraftModel): Observable<UserObject> {
    return this.api.update(id, draft).pipe(map((user) => UserMapper.toUser(user)));
  }

  remove(id: string): Observable<void> {
    return this.api.remove(id);
  }
}
