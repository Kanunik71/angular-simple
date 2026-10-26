import { Injectable, isDevMode } from '@angular/core';

import { UserResponseModel } from '../../models/user/user-response.models';
import { DEFAULT_USERS } from './in-memory-db.defaults';
import { InMemoryDbSeed } from './in-memory-db.seed';

@Injectable({ providedIn: 'root' })
export class InMemoryDb {
  readonly users: UserResponseModel[] = initialUsers();
}

function initialUsers(): UserResponseModel[] {
  const defaults = DEFAULT_USERS.map((user) => ({ ...user }));
  const seed = isDevMode() ? InMemoryDbSeed.read() : null;

  if (!seed) {
    return defaults;
  }

  const seeded = seed.users.map((user) => ({ ...user }));
  return seed.mode === 'replace' ? seeded : [...defaults, ...seeded];
}
