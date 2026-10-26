import { Injectable, effect, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthState } from '../../../core/auth/auth.state';
import { allRoutes } from '../../../core/router/all-routes';
import { RouterService } from '../../../core/router/router.service';
import { FormValidators } from '../../../utils/forms/form.validators';

@Injectable()
export class LoginPageState {
  private readonly auth = inject(AuthState);
  private readonly router = inject(RouterService);

  readonly loading = this.auth.loading;
  readonly error = this.auth.error;
  readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [FormValidators.requiredTrim],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [FormValidators.requiredTrim],
    }),
  });

  constructor() {
    effect(() => {
      if (this.auth.isAuthenticated()) {
        void this.router.go(allRoutes.users.list());
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.auth.login(username.trim(), password);
  }
}
