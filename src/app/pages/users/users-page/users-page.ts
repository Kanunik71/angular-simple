import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { UserType } from '../../../models/user/user.models';
import { roleLabel } from '../../../models/user/user-role.models';
import { AuthState } from '../../../core/auth/auth.state';
import { UiButton } from '../../../ui-core/button/ui-button';
import { UiModal } from '../../../ui-core/modal/ui-modal';
import { UsersState } from '../users.state';

@Component({
  selector: 'app-users-page',
  imports: [TranslatePipe, UiButton, UiModal],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthState);
  protected readonly state = inject(UsersState);

  protected readonly roleLabel = roleLabel;
  protected readonly sessionName = this.auth.session;
  protected readonly pendingDelete = signal<UserType | null>(null);

  protected openCreate(): void {
    void this.router.navigateByUrl('/users/new');
  }

  protected openEdit(user: UserType): void {
    void this.router.navigate(['/users', user.id, 'edit']);
  }

  protected confirmDelete(): void {
    const user = this.pendingDelete();
    if (!user) {
      return;
    }
    this.state.remove(user.id);
    this.pendingDelete.set(null);
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}
