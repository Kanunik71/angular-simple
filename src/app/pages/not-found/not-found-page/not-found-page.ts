import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { PageContainer } from '../../../layout/page-container/page-container';
import { PageHeader } from '../../../layout/page-header/page-header';
import { UiButton } from '../../../ui-core/components/common/button/ui-button';
import { UiCard } from '../../../ui-core/components/layout/card/ui-card';

@Component({
  selector: 'app-not-found-page',
  imports: [TranslatePipe, PageContainer, PageHeader, UiButton, UiCard],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage {
  private readonly router = inject(RouterService);

  protected back(): void {
    void this.router.go(allRoutes.users.list());
  }
}
