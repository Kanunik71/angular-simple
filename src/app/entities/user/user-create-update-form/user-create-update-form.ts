import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UserModel, UserDraftModel, UserRoleEnum } from '../../../models/user/user.models';
import { ROLE_OPTIONS } from '../../../models/user/user-role.models';
import { FormValidators } from '../../../utils/forms/form.validators';
import { UiAlert } from '../../../ui-core/common/alert/ui-alert';
import { UiButton } from '../../../ui-core/common/button/ui-button';
import { UiForm } from '../../../ui-core/form/ui-form';
import { UiFormActions } from '../../../ui-core/form/ui-form-actions';
import { UiFormField } from '../../../ui-core/form/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/form/input/ui-input';
import { UiSelect } from '../../../ui-core/form/select/ui-select';

@Component({
  selector: 'app-user-create-update-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    UiAlert,
    UiButton,
    UiForm,
    UiFormActions,
    UiFormField,
    UiInput,
    UiSelect,
  ],
  templateUrl: './user-create-update-form.html',
})
export class UserCreateUpdateForm {
  readonly user = input<UserModel | null>(null);
  readonly saving = input(false);
  readonly serverError = input<string | null>(null);
  readonly submitted = output<UserDraftModel>();
  readonly cancelled = output<void>();

  protected readonly roles = ROLE_OPTIONS;
  protected readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [FormValidators.requiredTrim] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [FormValidators.requiredTrim, FormValidators.emailFormat],
    }),
    role: new FormControl<UserRoleEnum>('user', {
      nonNullable: true,
      validators: [FormValidators.requiredTrim],
    }),
  });

  constructor() {
    effect(() => {
      const user = this.user();
      this.form.reset({
        fullName: user?.fullName ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
      });
    });
  }

  protected submit(): void {
    if (this.saving()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitted.emit({
      fullName: value.fullName.trim(),
      email: value.email.trim(),
      role: value.role,
    });
  }
}
