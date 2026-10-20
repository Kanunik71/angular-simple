import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, catchError, of, switchMap } from 'rxjs';

import { UserDraftType, UserType } from '../../models/user/user.models';
import { UserFilterType } from '../../models/user/user-filter.models';
import { ComponentState } from '../../core/state/component.state';
import { ListState } from '../../core/state/list.state';
import { UserService } from '../../services/user/user.service';
import { ApiError } from '../../utils/http/api-error';
import { ToastService } from '../../ui-core/common/toast/toast.service';

@Injectable()
export class UsersState {
  private readonly service = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly toast = inject(ToastService);

  private readonly list = new ListState<UserType, UserFilterType>({
    initialFilters: { search: '', role: '' },
    pageSize: 10,
    errorMessage: (error) =>
      this.notifyError(error, ApiError.message(error, this.translate.instant('users.loadError'))),
    load: (query) => this.service.list(query),
  });
  private readonly selectedRequests = new Subject<string | null>();

  readonly users = this.list.items;
  readonly total = this.list.total;
  readonly page = this.list.page;
  readonly pageSize = this.list.pageSize;
  readonly pageCount = this.list.pageCount;
  readonly filters = this.list.filters;
  readonly listLoad = this.list.loadState;

  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);
  readonly removeError = signal<string | null>(null);
  readonly saved = signal(0);

  readonly selectedUser = signal<UserType | null>(null);
  readonly selectedId = signal<string | null>(null);
  readonly selected = new ComponentState();

  constructor() {
    this.selectedRequests
      .pipe(
        switchMap((id) => {
          if (!id) {
            this.selectedUser.set(null);
            this.selected.reset();
            return of(null);
          }

          this.selectedUser.set(null);
          return this.selected
            .load(() => this.service.get(id), {
              errorMessage: (error) => this.userErrorMessage(error),
            })
            .pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => {
        if (user) {
          this.selectedUser.set(user);
        }
      });

    this.list.reload();
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
    this.selectedId.set(id);
    this.selectedRequests.next(id);
  }

  clearSelected(): void {
    this.selectedId.set(null);
    this.selectedRequests.next(null);
  }

  create(draft: UserDraftType): void {
    this.save(this.service.create(draft), () => {
      this.list.loadFirst();
      this.toast.success(this.translate.instant('users.created'));
    });
  }

  update(id: string, draft: UserDraftType): void {
    this.save(this.service.update(id, draft), (user) => {
      this.selectedUser.set(user);
      this.list.reload();
      this.toast.success(this.translate.instant('users.updated'));
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
          this.toast.success(this.translate.instant('users.removed'));
          this.saving.set(false);
        },
        error: (error: unknown) => {
          this.removeError.set(
            this.notifyError(
              error,
              ApiError.message(error, this.translate.instant('users.removeError')),
            ),
          );
          this.saving.set(false);
        },
      });
  }

  clearFormError(): void {
    this.formError.set(null);
  }

  private userErrorMessage(error: unknown): string {
    const message =
      error instanceof HttpErrorResponse && error.status === 404
        ? this.translate.instant('userForm.notFound')
        : ApiError.message(error, this.translate.instant('users.loadUserError'));

    return this.notifyError(error, message);
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
        this.formError.set(
          this.notifyError(
            error,
            ApiError.message(error, this.translate.instant('users.saveError')),
          ),
        );
        this.saving.set(false);
      },
    });
  }

  private notifyError(error: unknown, message: string): string {
    console.error(error);
    this.toast.error(message);
    return message;
  }
}
