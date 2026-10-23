import { Component, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { UserRoleEnum } from '../../../models/user/user.models';
import { ROLE_OPTIONS } from '../../../models/user/user-role.models';
import { UiFormField } from '../../../ui-core/components/form/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/components/form/input/ui-input';
import { UiSelect } from '../../../ui-core/components/form/select/ui-select';

export type UserCreateUpdateFormGroup = FormGroup<{
  fullName: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<UserRoleEnum>;
}>;

@Component({
  selector: 'app-user-create-update-form',
  imports: [ReactiveFormsModule, UiFormField, UiInput, UiSelect],
  templateUrl: './user-create-update-form.html',
})
export class UserCreateUpdateForm {
  readonly form = input.required<UserCreateUpdateFormGroup>();

  protected readonly roles = ROLE_OPTIONS;
}
