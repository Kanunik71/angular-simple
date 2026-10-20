import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthState } from '../../../core/auth/auth.state';
import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { FormValidators } from '../../../utils/forms/form.validators';
import { UiAlert } from '../../../ui-core/alert/ui-alert';
import { UiButton } from '../../../ui-core/button/ui-button';
import { UiCard } from '../../../ui-core/card/ui-card';
import { UiForm } from '../../../ui-core/form/ui-form';
import { UiFormActions } from '../../../ui-core/form/ui-form-actions';
import { UiFormField } from '../../../ui-core/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/input/ui-input';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    UiAlert,
    UiButton,
    UiCard,
    UiForm,
    UiFormActions,
    UiFormField,
    UiInput,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly auth = inject(AuthState);
  private readonly router = inject(RouterService);

  protected readonly loading = this.auth.loading;
  protected readonly error = this.auth.error;
  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [FormValidators.requiredTrim] }),
    password: new FormControl('', { nonNullable: true, validators: [FormValidators.requiredTrim] }),
  });

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        void this.router.go(allRoutes.users.list());
      }
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.auth.login(username.trim(), password);
  }
}
