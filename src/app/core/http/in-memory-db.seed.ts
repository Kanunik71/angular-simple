import type { UserResponseModel } from '../../models/user/user-response.models';

export type DbSeedMode = 'append' | 'replace';

export interface DbSeedModel {
  mode: DbSeedMode;
  users: UserResponseModel[];
}

export const DB_SEED_KEY = 'exam.e2e.dbSeed';

export class InMemoryDbSeed {
  static read(): DbSeedModel | null {
    try {
      const raw = sessionStorage.getItem(DB_SEED_KEY);
      if (!raw) {
        return null;
      }

      const value: unknown = JSON.parse(raw);
      return isDbSeed(value) ? value : null;
    } catch {
      return null;
    }
  }
}

function isDbSeed(value: unknown): value is DbSeedModel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const seed = value as Partial<DbSeedModel>;
  return (
    (seed.mode === 'append' || seed.mode === 'replace') &&
    Array.isArray(seed.users) &&
    seed.users.every(isUser)
  );
}

function isUser(value: unknown): value is UserResponseModel {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Partial<UserResponseModel>;
  return (
    typeof user.id === 'string' &&
    typeof user.fullName === 'string' &&
    typeof user.email === 'string' &&
    (user.role === 'admin' || user.role === 'user')
  );
}
