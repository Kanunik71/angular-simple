import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { PageContainer } from '../../../layout/page-container/page-container';
import { PageHeader } from '../../../layout/page-header/page-header';
import { UiAlert } from '../../../ui-core/components/common/alert/ui-alert';
import { UiButton } from '../../../ui-core/components/common/button/ui-button';
import { UiSkeleton } from '../../../ui-core/components/common/skeleton/ui-skeleton';
import { UiForm } from '../../../ui-core/components/form/ui-form';
import { UiFormActions } from '../../../ui-core/components/form/ui-form-actions';
import { UiCard } from '../../../ui-core/components/layout/card/ui-card';
import { UserCreateUpdateForm } from '../../../entities/user/user-create-update-form/user-create-update-form';
import { UserCreateUpdatePageState } from './user-create-update-page.state';

@Component({
  selector: 'app-user-create-update-page',
  imports: [
    TranslatePipe,
    PageContainer,
    PageHeader,
    UiAlert,
    UiButton,
    UiCard,
    UiForm,
    UiFormActions,
    UiSkeleton,
    UserCreateUpdateForm,
  ],
  providers: [UserCreateUpdatePageState],
  templateUrl: './user-create-update-page.html',
  styleUrl: './user-create-update-page.scss',
})
export class UserCreateUpdatePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(RouterService);
  protected readonly state = inject(UserCreateUpdatePageState);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private seenSaves = this.state.saved();

  protected readonly userId = computed(() => this.params().get('id'));
  protected readonly titleKey = computed(() =>
    this.userId() ? 'userForm.editTitle' : 'userForm.createTitle',
  );

  constructor() {
    effect(() => {
      const saves = this.state.saved();
      if (saves === this.seenSaves) {
        return;
      }
      this.seenSaves = saves;
      void this.router.go(allRoutes.users.list());
    });
  }

  ngOnInit(): void {
    this.state.init(this.userId());
  }

  protected back(): void {
    void this.router.go(allRoutes.users.list());
  }
}
