import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { UserDraftType } from '../../../models/user/user.models';
import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { PageContainer } from '../../../layout/page-container/page-container';
import { PageHeader } from '../../../layout/page-header/page-header';
import { UiAlert } from '../../../ui-core/alert/ui-alert';
import { UiButton } from '../../../ui-core/button/ui-button';
import { UiCard } from '../../../ui-core/card/ui-card';
import { UserForm } from '../../../entities/user/user-form/user-form';
import { UsersState } from '../users.state';

@Component({
  selector: 'app-user-form-page',
  imports: [TranslatePipe, PageContainer, PageHeader, UiAlert, UiButton, UiCard, UserForm],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss',
})
export class UserFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(RouterService);
  protected readonly state = inject(UsersState);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private seenSaves = this.state.saved();

  protected readonly userId = computed(() => this.params().get('id'));
  protected readonly titleKey = computed(() =>
    this.userId() ? 'userForm.editTitle' : 'userForm.createTitle',
  );
  protected readonly user = this.state.selectedUser;
  private readonly selectionRequested = signal(false);
  protected readonly loading = computed(
    () => this.userId() !== null && (this.state.selectedLoading() || !this.selectionRequested()),
  );
  protected readonly missing = computed(
    () =>
      this.selectionRequested() &&
      this.userId() !== null &&
      !this.state.selectedLoading() &&
      !this.state.selectedError() &&
      this.user() === null,
  );

  constructor() {
    this.state.clearFormError();

    effect(() => {
      const id = this.userId();
      if (id) {
        this.selectionRequested.set(true);
        this.state.loadUser(id);
        return;
      }
      this.selectionRequested.set(false);
      this.state.clearSelected();
    });

    effect(() => {
      const saves = this.state.saved();
      if (saves === this.seenSaves) {
        return;
      }
      this.seenSaves = saves;
      void this.router.go(allRoutes.users.list());
    });
  }

  protected save(draft: UserDraftType): void {
    const id = this.userId();
    if (id) {
      this.state.update(id, draft);
      return;
    }

    this.state.create(draft);
  }

  protected back(): void {
    this.state.clearFormError();
    this.state.clearSelected();
    void this.router.go(allRoutes.users.list());
  }
}
