import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UserType } from '../../../../models/user/user.models';
import { roleLabel } from '../../../../models/user/user-role.models';
import { UiButton } from '../../../../ui-core/button/ui-button';
import { UiSkeleton } from '../../../../ui-core/skeleton/ui-skeleton';
import { UiTableCell } from '../../../../ui-core/table/ui-table-cell';

@Component({
  selector: 'tr[app-user-list-row]',
  imports: [TranslatePipe, UiButton, UiTableCell],
  templateUrl: './user-list-row.html',
  styleUrl: './user-list-row.scss',
})
export class UserListRow {
  readonly user = input.required<UserType>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly roleLabel = roleLabel;
}

@Component({
  selector: 'tr[app-user-list-row-skeleton]',
  imports: [UiTableCell, UiSkeleton],
  templateUrl: './user-list-row-skeleton.html',
  styleUrl: './user-list-row.scss',
})
export class UserListRowSkeleton {}
