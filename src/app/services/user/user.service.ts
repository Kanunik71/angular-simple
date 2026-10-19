import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { UserDraftType, UserType } from '../../models/user/user.models';
import { UsersApi } from '../../core/api/users.api';
import { UserMapper } from './user.mapper';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(UsersApi);

  list(): Observable<UserType[]> {
    return this.api.list().pipe(map((rows) => rows.map((row) => UserMapper.toUser(row))));
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
