import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { InMemoryDb } from '../http/in-memory-db';
import { ListPageType, ListQueryType } from '../../models/common/list.models';
import { UserDraftType, UserRoleEnum } from '../../models/user/user.models';
import { UserFilterType } from '../../models/user/user-filter.models';
import { UserResponseType } from '../../models/user/user-response.models';
import { Mock } from '../../utils/mock/mock';
import { UsersApiContract } from './users.api';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class UsersApiMock implements UsersApiContract {
  private readonly db = inject(InMemoryDb);

  list(query: ListQueryType<UserFilterType>): Observable<ListPageType<UserResponseType>> {
    const search = query.filters.search.trim().toLowerCase();
    const role = query.filters.role;
    const filtered = this.db.users.filter((user) => {
      const matchesSearch =
        !search ||
        user.fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);
      const matchesRole = !role || user.role === role;
      return matchesSearch && matchesRole;
    });

    const page = Math.max(1, Math.floor(query.page));
    const pageSize = Math.max(1, Math.floor(query.pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize).map((user) => ({ ...user }));

    return of({ items, total: filtered.length });
  }

  listFromParams(params: HttpParams): Observable<ListPageType<UserResponseType>> {
    return this.list({
      page: readPositiveNumber(params, 'page', 1),
      pageSize: readPositiveNumber(params, 'pageSize', DEFAULT_PAGE_SIZE),
      filters: {
        search: params.get('search') ?? '',
        role: readRoleFilter(params.get('role')),
      },
    });
  }

  get(id: string): Observable<UserResponseType> {
    const user = this.db.users.find((item) => item.id === id);
    return user ? of({ ...user }) : Mock.fail(404, 'Пользователь не найден');
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
    this.db.users.unshift(user);
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

function readPositiveNumber(params: HttpParams, key: string, fallback: number): number {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function readRoleFilter(value: string | null): UserRoleEnum | '' {
  return value !== null && isRole(value) ? value : '';
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
