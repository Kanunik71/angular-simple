import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { InMemoryDb } from '../http/in-memory-db';
import { UserDraftType, UserRoleEnum } from '../../models/user/user.models';
import { UserResponseType } from '../../models/user/user-response.models';
import { Mock } from '../../utils/mock/mock';
import { UsersApiContract } from './users.api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable({ providedIn: 'root' })
export class UsersApiMock implements UsersApiContract {
  private readonly db = inject(InMemoryDb);

  list(): Observable<UserResponseType[]> {
    return of(this.db.users.map((user) => ({ ...user })));
  }

  create(body: UserDraftType): Observable<UserResponseType> {
    const draft = readDraft(body);
    if (typeof draft === 'string') {
      return Mock.fail(400, draft);
    }

    if (this.hasEmail(draft.email)) {
      return Mock.fail(400, 'Пользователь с таким email уже существует');
    }

    const user: UserResponseType = { id: crypto.randomUUID(), ...draft };
    this.db.users.push(user);
    return of({ ...user });
  }

  update(id: string, body: UserDraftType): Observable<UserResponseType> {
    const current = this.db.users.find((user) => user.id === id);
    if (!current) {
      return Mock.fail(404, 'Пользователь не найден');
    }

    const draft = readDraft(body);
    if (typeof draft === 'string') {
      return Mock.fail(400, draft);
    }

    if (this.hasEmail(draft.email, id)) {
      return Mock.fail(400, 'Пользователь с таким email уже существует');
    }

    current.fullName = draft.fullName;
    current.email = draft.email;
    current.role = draft.role;
    return of({ ...current });
  }

  remove(id: string): Observable<void> {
    const index = this.db.users.findIndex((user) => user.id === id);
    if (index < 0) {
      return Mock.fail(404, 'Пользователь не найден');
    }

    this.db.users.splice(index, 1);
    return of(undefined);
  }

  private hasEmail(email: string, exceptId?: string): boolean {
    return this.db.users.some((user) => user.email === email && user.id !== exceptId);
  }
}

function readDraft(body: unknown): UserDraftType | string {
  const source = Mock.record(body);
  const fullName = Mock.text(source, 'fullName');
  const email = Mock.text(source, 'email').toLowerCase();
  const role = Mock.text(source, 'role');

  if (!fullName) {
    return 'Заполните имя';
  }
  if (!EMAIL_PATTERN.test(email)) {
    return 'Введите корректный email';
  }
  if (!isRole(role)) {
    return 'Выберите роль';
  }

  return { fullName, email, role };
}

function isRole(value: string): value is UserRoleEnum {
  return value === 'admin' || value === 'user';
}
