import { Component } from '@angular/core';

@Component({
  selector: 'ui-form-actions',
  host: { class: 'ui-form-actions' },
  template: '<ng-content />',
  styleUrl: './ui-form-actions.scss',
})
export class UiFormActions {}
