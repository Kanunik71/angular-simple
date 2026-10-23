import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UserObject } from '../../../models/user/user.models';
import { USER_ROLE_FILTER_OPTIONS } from '../../../models/user/user-role.models';
import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { PageContainer } from '../../../layout/page-container/page-container';
import { PageHeader } from '../../../layout/page-header/page-header';
import { UiAlert } from '../../../ui-core/components/common/alert/ui-alert';
import { UiButton } from '../../../ui-core/components/common/button/ui-button';
import { UiSpinner } from '../../../ui-core/components/common/spinner/ui-spinner';
import { UiFilters } from '../../../ui-core/components/form/filters/ui-filters';
import { UiFormField } from '../../../ui-core/components/form/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/components/form/input/ui-input';
import { UiSelect } from '../../../ui-core/components/form/select/ui-select';
import { UiCard } from '../../../ui-core/components/layout/card/ui-card';
import { UiPagination } from '../../../ui-core/components/layout/pagination/ui-pagination';
import {
  UiTable,
  UiTableColumn,
  UiTableRow,
} from '../../../ui-core/components/layout/table/ui-table';
import {
  UiTableSkeleton,
  UiTableSkeletonRow,
} from '../../../ui-core/components/layout/table/ui-table-skeleton';
import { UserListRow, UserListRowSkeleton } from './user-list-row/user-list-row';
import { UsersPageState } from './users-page.state';

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
    UiFilters,
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
})
export class UsersPage implements OnInit {
  private readonly router = inject(RouterService);
  protected readonly state = inject(UsersPageState);

  protected readonly roleFilterOptions = USER_ROLE_FILTER_OPTIONS;
  protected readonly columns: UiTableColumn[] = [
    { key: 'name', labelKey: 'users.columnName' },
    { key: 'email', labelKey: 'users.columnEmail' },
    { key: 'role', labelKey: 'users.columnRole' },
    { key: 'actions', labelKey: 'users.columnActions', align: 'right' },
  ];
  protected readonly rowKey = (user: UserObject): string => user.id;

  ngOnInit(): void {
    this.state.init();
  }

  protected openCreate(): void {
    void this.router.go(allRoutes.users.new());
  }

  protected openEdit(user: UserObject): void {
    void this.router.go(allRoutes.users.edit(user.id));
  }

  protected requestDelete(user: UserObject): void {
    this.state.remove(user);
  }
}
