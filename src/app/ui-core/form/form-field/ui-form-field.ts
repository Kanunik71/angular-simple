import { Component, computed, contentChild, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UI_FORM_FIELD_CONTROL } from './ui-form-field-control';
import { UiFormErrors } from './ui-form-errors';

@Component({
  selector: 'ui-form-field',
  imports: [TranslatePipe, UiFormErrors],
  host: { class: 'ui-form-field' },
  templateUrl: './ui-form-field.html',
  styleUrl: './ui-form-field.scss',
})
export class UiFormField {
  readonly label = input.required<string>();

  private readonly fieldControl = contentChild(UI_FORM_FIELD_CONTROL);
  protected readonly control = computed(() => this.fieldControl()?.control ?? null);
  protected readonly fieldId = computed(() => this.fieldControl()?.fieldId ?? null);
}
