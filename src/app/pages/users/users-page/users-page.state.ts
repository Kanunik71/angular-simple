import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { UserFilterModel } from '../../../models/user/user-filter.models';
import { UserModel, UserRoleEnum } from '../../../models/user/user.models';
import { ComponentState } from '../../../core/state/component.state';
import { ListState } from '../../../core/state/list.state';
import { UserService } from '../../../services/user/user.service';
import { ToastService } from '../../../ui-core/common/toast/toast.service';
import { ApiError } from '../../../utils/http/api-error';

@Injectable()
export class UsersPageState {
  private readonly service = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly toast = inject(ToastService);

  readonly page = new ComponentState();
  readonly list = new ListState<UserModel, UserFilterModel>({
    initialFilters: { search: '', role: '' },
    pageSize: 10,
    errorMessage: (error) =>
      this.notifyError(error, ApiError.message(error, this.translate.instant('users.loadError'))),
    load: (query) => this.service.list(query),
  });
  readonly filterForm = new FormGroup({
    search: new FormControl(this.list.filters().search, { nonNullable: true }),
    role: new FormControl<UserRoleEnum | ''>(this.list.filters().role, {
      nonNullable: true,
    }),
  });

  readonly removing = signal(false);
  readonly removeError = signal<string | null>(null);

  constructor() {
    this.page.add(this.list.loadState);

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (previous, current) =>
            previous.search === current.search && previous.role === current.role,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.setFilters(this.filterForm.getRawValue()));
  }

  init(): void {
    this.list.reload();
  }

  setPage(page: number): void {
    this.list.setPage(page);
  }

  private setFilters(filters: UserFilterModel): void {
    this.list.setFilters(filters);
  }

  remove(id: string): void {
    if (this.removing()) {
      return;
    }

    this.removing.set(true);
    this.removeError.set(null);
    this.service
      .remove(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.list.reload();
          this.toast.success(this.translate.instant('users.removed'));
          this.removing.set(false);
        },
        error: (error: unknown) => {
          this.removeError.set(
            this.notifyError(
              error,
              ApiError.message(error, this.translate.instant('users.removeError')),
            ),
          );
          this.removing.set(false);
        },
      });
  }

  private notifyError(error: unknown, message: string): string {
    console.error(error);
    this.toast.error(message);
    return message;
  }
}
