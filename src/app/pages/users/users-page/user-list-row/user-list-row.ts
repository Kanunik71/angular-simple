import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UserObject } from '../../../../models/user/user.models';
import { roleLabelKey } from '../../../../models/user/user-role.models';
import { UiButton } from '../../../../ui-core/components/common/button/ui-button';
import { UiSkeleton } from '../../../../ui-core/components/common/skeleton/ui-skeleton';
import { UiTableCell } from '../../../../ui-core/components/layout/table/ui-table-cell';

@Component({
  selector: 'tr[app-user-list-row]',
  imports: [TranslatePipe, UiButton, UiTableCell],
  templateUrl: './user-list-row.html',
  styleUrl: './user-list-row.scss',
})
export class UserListRow {
  readonly user = input.required<UserObject>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  protected readonly roleLabelKey = roleLabelKey;
}

@Component({
  selector: 'tr[app-user-list-row-skeleton]',
  imports: [UiTableCell, UiSkeleton],
  templateUrl: './user-list-row-skeleton.html',
  styleUrl: './user-list-row.scss',
})
export class UserListRowSkeleton {}
