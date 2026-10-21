import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UserDraftModel, UserRoleEnum } from '../../../models/user/user.models';
import { ROLE_OPTIONS } from '../../../models/user/user-role.models';
import { UiAlert } from '../../../ui-core/common/alert/ui-alert';
import { UiButton } from '../../../ui-core/common/button/ui-button';
import { UiForm } from '../../../ui-core/form/ui-form';
import { UiFormActions } from '../../../ui-core/form/ui-form-actions';
import { UiFormField } from '../../../ui-core/form/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/form/input/ui-input';
import { UiSelect } from '../../../ui-core/form/select/ui-select';

export type UserCreateUpdateFormGroup = FormGroup<{
  fullName: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<UserRoleEnum>;
}>;

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
  readonly form = input.required<UserCreateUpdateFormGroup>();
  readonly saving = input(false);
  readonly serverError = input<string | null>(null);
  readonly submitted = output<UserDraftModel>();
  readonly cancelled = output<void>();

  protected readonly roles = ROLE_OPTIONS;

  protected submit(): void {
    if (this.saving()) {
      return;
    }

    const form = this.form();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const value = form.getRawValue();
    this.submitted.emit({
      fullName: value.fullName.trim(),
      email: value.email.trim(),
      role: value.role,
    });
  }
}
