import { DestroyRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { UserRoleEnum, UserType } from '../../../models/user/user.models';
import { USER_ROLE_FILTER_OPTIONS } from '../../../models/user/user-role.models';
import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { PageContainer } from '../../../layout/page-container/page-container';
import { PageHeader } from '../../../layout/page-header/page-header';
import { UiAlert } from '../../../ui-core/alert/ui-alert';
import { UiButton } from '../../../ui-core/button/ui-button';
import { UiCard } from '../../../ui-core/card/ui-card';
import { UiInput } from '../../../ui-core/input/ui-input';
import { UiModal } from '../../../ui-core/modal/ui-modal';
import { UiPagination } from '../../../ui-core/pagination/ui-pagination';
import { UiSelect } from '../../../ui-core/select/ui-select';
import { UiTable, UiTableColumn, UiTableRow } from '../../../ui-core/table/ui-table';
import { UserListRow } from './user-list-row/user-list-row';
import { UsersState } from '../users.state';

@Component({
  selector: 'app-users-page',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    PageContainer,
    PageHeader,
    UiAlert,
    UiButton,
    UiCard,
    UiInput,
    UiModal,
    UiPagination,
    UiSelect,
    UiTable,
    UiTableRow,
    UserListRow,
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {
  private readonly router = inject(RouterService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly state = inject(UsersState);

  protected readonly roleFilterOptions = USER_ROLE_FILTER_OPTIONS;
  protected readonly columns: UiTableColumn[] = [
    { key: 'name', label: 'users.columnName' },
    { key: 'email', label: 'users.columnEmail' },
    { key: 'role', label: 'users.columnRole' },
    { key: 'actions', label: 'users.columnActions', align: 'right' },
  ];
  protected readonly rowKey = (user: UserType): string => user.id;
  protected readonly pendingDelete = signal<UserType | null>(null);
  protected readonly filterForm = new FormGroup({
    search: new FormControl(this.state.filters().search, { nonNullable: true }),
    role: new FormControl<UserRoleEnum | ''>(this.state.filters().role, {
      nonNullable: true,
    }),
  });

  constructor() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (previous, current) =>
            previous.search === current.search && previous.role === current.role,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.state.setFilters(this.filterForm.getRawValue()));
  }

  protected openCreate(): void {
    void this.router.go(allRoutes.users.new());
  }

  protected openEdit(user: UserType): void {
    void this.router.go(allRoutes.users.edit(user.id));
  }

  protected confirmDelete(): void {
    const user = this.pendingDelete();
    if (!user) {
      return;
    }
    this.state.remove(user.id);
    this.pendingDelete.set(null);
  }
}
