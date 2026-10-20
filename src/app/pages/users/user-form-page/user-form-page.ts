import { Component, computed, effect, inject } from '@angular/core';
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
import { UiSkeleton } from '../../../ui-core/skeleton/ui-skeleton';
import { UserForm } from '../../../entities/user/user-form/user-form';
import { UserFormPageState } from './user-form-page.state';
import { UsersState } from '../users.state';

@Component({
  selector: 'app-user-form-page',
  imports: [
    TranslatePipe,
    PageContainer,
    PageHeader,
    UiAlert,
    UiButton,
    UiCard,
    UiSkeleton,
    UserForm,
  ],
  providers: [UserFormPageState],
  templateUrl: './user-form-page.html',
  styleUrl: './user-form-page.scss',
})
export class UserFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(RouterService);
  protected readonly state = inject(UsersState);
  protected readonly page = inject(UserFormPageState);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private seenSaves = this.state.saved();

  protected readonly userId = computed(() => this.params().get('id'));
  protected readonly titleKey = computed(() =>
    this.userId() ? 'userForm.editTitle' : 'userForm.createTitle',
  );
  protected readonly user = computed(() => {
    const id = this.userId();
    const user = this.state.selectedUser();
    return id && user?.id === id ? user : null;
  });
  protected readonly pageError = computed(() => {
    const id = this.userId();
    if (!id || id !== this.state.selectedId()) {
      return null;
    }

    return this.page.state.error();
  });
  protected readonly loading = computed(() => {
    const id = this.userId();
    if (!id) {
      return false;
    }

    return this.user() === null && !this.pageError();
  });

  constructor() {
    this.state.clearFormError();
    this.state.clearSelected();

    effect(() => {
      const id = this.userId();
      if (id) {
        this.state.loadUser(id);
        return;
      }
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
