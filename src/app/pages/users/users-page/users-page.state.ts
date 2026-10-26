import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { DEFAULT_USER_FILTER, UserFilterModel } from '../../../models/user/user-filter.models';
import { UserObject } from '../../../models/user/user.models';
import { UserRoleEnum } from '../../../models/user/user-role.models';
import { LoaderState } from '../../../core/state/loader.state';
import { ListState } from '../../../core/state/list.state';
import { UserActionService } from '../../../services/user/user-action.service';
import { UserService } from '../../../services/user/user.service';
import { ToastService } from '../../../ui-core/services/toast.service';

@Injectable()
export class UsersPageState {
  private readonly service = inject(UserService);
  private readonly actions = inject(UserActionService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);

  readonly loader = new LoaderState();
  readonly list = new ListState<UserObject, UserFilterModel>({
    initialFilters: DEFAULT_USER_FILTER,
    pageSize: 10,
    errorMessage: (error) => this.toast.fromError(error, 'users.loadError'),
    load: (query) => this.service.list(query),
  });
  readonly filterForm = new FormGroup({
    search: new FormControl(this.list.filters().search, { nonNullable: true }),
    role: new FormControl<UserRoleEnum | ''>(this.list.filters().role, {
      nonNullable: true,
    }),
  });

  constructor() {
    this.loader.add(this.list.loader);

    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.list.setFilters(this.filterForm.getRawValue()));
  }

  init(): void {
    this.list.reload();
  }

  setPage(page: number): void {
    this.list.setPage(page);
  }

  remove(user: UserObject): void {
    this.actions
      .remove(user, this.loader)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.list.reload());
  }
}
