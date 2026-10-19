import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { UserType, UserDraftType } from '../../../models/user/user.models';
import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { UiButton } from '../../../ui-core/button/ui-button';
import { UserForm } from '../../../entities/user/user-form/user-form';
import { UsersState } from '../users.state';

@Component({
  selector: 'app-user-form-page',
  imports: [TranslatePipe, UiButton, UserForm],
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
  protected readonly user = computed<UserType | null>(() => {
    const id = this.userId();
    return id ? (this.state.users().find((item) => item.id === id) ?? null) : null;
  });
  protected readonly missing = computed(
    () => this.userId() !== null && !this.state.loading() && this.user() === null,
  );

  constructor() {
    this.state.clearFormError();

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
    void this.router.go(allRoutes.users.list());
  }
}
