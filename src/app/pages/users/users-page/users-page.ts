import { Component, DestroyRef, inject } from '@angular/core';
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
import { UiAlert } from '../../../ui-core/common/alert/ui-alert';
import { UiButton } from '../../../ui-core/common/button/ui-button';
import { UiSpinner } from '../../../ui-core/common/spinner/ui-spinner';
import { UiFormField } from '../../../ui-core/form/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/form/input/ui-input';
import { UiSelect } from '../../../ui-core/form/select/ui-select';
import { UiCard } from '../../../ui-core/layout/card/ui-card';
import { UiPagination } from '../../../ui-core/layout/pagination/ui-pagination';
import { UiTable, UiTableColumn, UiTableRow } from '../../../ui-core/layout/table/ui-table';
import {
  UiTableSkeleton,
  UiTableSkeletonRow,
} from '../../../ui-core/layout/table/ui-table-skeleton';
import { ModalRef } from '../../../ui-core/modal/modal-ref';
import { ModalService } from '../../../ui-core/modal/modal.service';
import { UserListRow, UserListRowSkeleton } from './user-list-row/user-list-row';
import { UsersPageState } from './users-page.state';
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
    UiFormField,
    UiInput,
    UiPagination,
    UiSelect,
    UiSpinner,
    UiTable,
    UiTableRow,
    UiTableSkeleton,
    UiTableSkeletonRow,
    UserListRow,
    UserListRowSkeleton,
  ],
  providers: [UsersPageState],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {
  private readonly router = inject(RouterService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modal = inject(ModalService);
  protected readonly state = inject(UsersState);
  protected readonly page = inject(UsersPageState);

  protected readonly roleFilterOptions = USER_ROLE_FILTER_OPTIONS;
  protected readonly columns: UiTableColumn[] = [
    { key: 'name', label: 'users.columnName' },
    { key: 'email', label: 'users.columnEmail' },
    { key: 'role', label: 'users.columnRole' },
    { key: 'actions', label: 'users.columnActions', align: 'right' },
  ];
  protected readonly rowKey = (user: UserType): string => user.id;
  protected readonly filterForm = new FormGroup({
    search: new FormControl(this.state.filters().search, { nonNullable: true }),
    role: new FormControl<UserRoleEnum | ''>(this.state.filters().role, {
      nonNullable: true,
    }),
  });

  private deleteRef: ModalRef<boolean> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.deleteRef?.close(null));

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

  protected requestDelete(user: UserType): void {
    this.deleteRef?.close(null);
    const ref = this.modal.confirm({
      title: 'users.deleteTitle',
      message: 'users.deleteConfirm',
      messageParams: { name: user.fullName },
      confirmLabel: 'users.confirmDelete',
      variant: 'danger',
    });
    this.deleteRef = ref;

    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((confirmed) => {
      this.deleteRef = null;
      if (confirmed) {
        this.state.remove(user.id);
      }
    });
  }
}
