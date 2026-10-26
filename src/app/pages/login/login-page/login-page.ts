import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UiAlert } from '../../../ui-core/components/common/alert/ui-alert';
import { UiButton } from '../../../ui-core/components/common/button/ui-button';
import { UiForm } from '../../../ui-core/components/form/ui-form';
import { UiFormActions } from '../../../ui-core/components/form/ui-form-actions';
import { UiFormField } from '../../../ui-core/components/form/form-field/ui-form-field';
import { UiInput } from '../../../ui-core/components/form/input/ui-input';
import { UiCard } from '../../../ui-core/components/layout/card/ui-card';
import { LoginPageState } from './login-page.state';

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
  providers: [LoginPageState],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  protected readonly state = inject(LoginPageState);
}
