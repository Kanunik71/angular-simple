import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { UserType, UserDraftType } from '../../models/user/user.models';
import { UserService } from '../../services/user/user.service';
import { ApiError } from '../../utils/http/api-error';

@Injectable()
export class UsersState {
  private readonly service = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly users = signal<UserType[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly formError = signal<string | null>(null);
  readonly saved = signal(0);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(ApiError.message(error, this.translate.instant('users.loadError')));
          this.loading.set(false);
        },
      });
  }

  create(draft: UserDraftType): void {
    this.save(this.service.create(draft), (user) => {
      this.users.update((users) => [user, ...users]);
    });
  }

  update(id: string, draft: UserDraftType): void {
    this.save(this.service.update(id, draft), (user) => {
      this.users.update((users) => users.map((item) => (item.id === user.id ? user : item)));
    });
  }

  remove(id: string): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.service
      .remove(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.users.update((users) => users.filter((user) => user.id !== id));
          this.saving.set(false);
        },
        error: (error: unknown) => {
          this.error.set(ApiError.message(error, this.translate.instant('users.removeError')));
          this.saving.set(false);
        },
      });
  }

  clearFormError(): void {
    this.formError.set(null);
  }

  private save(request: ReturnType<UserService['create']>, apply: (user: UserType) => void): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        apply(user);
        this.saved.update((count) => count + 1);
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.formError.set(ApiError.message(error, this.translate.instant('users.saveError')));
        this.saving.set(false);
      },
    });
  }
}
