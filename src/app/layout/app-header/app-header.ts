import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthState } from '../../core/auth/auth.state';
import { allRoutes } from '../../core/router/all-routes';
import { RouterService } from '../../core/router/router.service';
import { UiButton } from '../../ui-core/components/common/button/ui-button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, UiButton],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  private readonly auth = inject(AuthState);
  private readonly router = inject(RouterService);

  protected readonly usersLink = allRoutes.users.list();
  protected readonly session = this.auth.session;

  protected logout(): void {
    this.auth.logout();
    void this.router.go(allRoutes.login());
  }
}
