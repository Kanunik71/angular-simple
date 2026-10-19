import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { UserType, UserDraftType } from '../../models/user/user.models';
import { UserFilterType } from '../../models/user/user-filter.models';
import { ListState } from '../../core/state/list.state';
import { UserService } from '../../services/user/user.service';
import { ApiError } from '../../utils/http/api-error';

@Injectable()
export class UsersState {
  private readonly service = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  private readonly list = new ListState<UserType, UserFilterType>({
    initialFilters: { search: '', role: '' },
    pageSize: 10,
    loadErrorKey: 'users.loadError',
    load: (query) => this.service.list(query),
  });

  readonly users = this.list.items;
  readonly total = this.list.total;
  readonly page = this.list.page;
  readonly pageSize = this.list.pageSize;
  readonly pageCount = this.list.pageCount;
  readonly filters = this.list.filters;
  readonly loading = this.list.loading;
  readonly listError = this.list.error;

  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly removeError = signal<string | null>(null);
  readonly error = computed(() => this.listError() ?? this.removeError());
  readonly saved = signal(0);

  readonly selectedUser = signal<UserType | null>(null);
  readonly selectedLoading = signal(false);
  readonly selectedError = signal<string | null>(null);

  private selectedRequest = 0;

  constructor() {
    this.list.load();
  }

  setPage(page: number): void {
    this.list.setPage(page);
  }

  setFilters(filters: UserFilterType): void {
    this.list.setFilters(filters);
  }

  reload(): void {
    this.list.reload();
  }

  loadUser(id: string): void {
    const request = ++this.selectedRequest;
    this.selectedLoading.set(true);
    this.selectedUser.set(null);
    this.selectedError.set(null);

    this.service
      .get(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          if (request !== this.selectedRequest) {
            return;
          }
          this.selectedUser.set(user);
          this.selectedLoading.set(false);
        },
        error: (error: unknown) => {
          if (request !== this.selectedRequest) {
            return;
          }
          this.selectedLoading.set(false);
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return;
          }
          this.selectedError.set(
            ApiError.message(error, this.translate.instant('users.loadUserError')),
          );
        },
      });
  }

  clearSelected(): void {
    this.selectedRequest++;
    this.selectedUser.set(null);
    this.selectedLoading.set(false);
    this.selectedError.set(null);
  }

  create(draft: UserDraftType): void {
    this.save(this.service.create(draft), () => this.list.loadFirst());
  }

  update(id: string, draft: UserDraftType): void {
    this.save(this.service.update(id, draft), (user) => {
      this.selectedUser.set(user);
      this.list.reload();
    });
  }

  remove(id: string): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.removeError.set(null);
    this.service
      .remove(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.selectedUser()?.id === id) {
            this.clearSelected();
          }
          this.list.reload();
          this.saving.set(false);
        },
        error: (error: unknown) => {
          this.removeError.set(
            ApiError.message(error, this.translate.instant('users.removeError')),
          );
          this.saving.set(false);
        },
      });
  }

  clearFormError(): void {
    this.formError.set(null);
  }

  private save(request: Observable<UserType>, after: (user: UserType) => void): void {
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.formError.set(null);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        after(user);
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
