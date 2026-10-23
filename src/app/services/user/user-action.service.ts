import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, filter, switchMap, tap } from 'rxjs';

import { UserObject } from '../../models/user/user.models';
import { LoaderState } from '../../core/state/loader.state';
import { ConfirmService } from '../../ui-core/services/modal/confirm.service';
import { ToastService } from '../../ui-core/services/toast.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserActionService {
  private readonly users = inject(UserService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  remove(user: UserObject, loader: LoaderState): Observable<void> {
    return loader
      .run(
        () =>
          this.confirm
            .ask({
              titleKey: 'users.deleteTitle',
              messageKey: 'users.deleteConfirm',
              messageParams: { name: user.fullName },
              confirmLabelKey: 'users.confirmDelete',
              variant: 'danger',
            })
            .pipe(
              filter((confirmed) => confirmed),
              switchMap(() => this.users.remove(user.id)),
            ),
        {
          errorMessage: (error) => this.toast.fromError(error, 'users.removeError'),
        },
      )
      .pipe(tap(() => this.toast.success(this.translate.instant('users.removed'))));
  }
}
