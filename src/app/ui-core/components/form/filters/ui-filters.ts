import { Component } from '@angular/core';

@Component({
  selector: 'ui-filters',
  host: { class: 'ui-filters' },
  template: '<ng-content />',
  styleUrl: './ui-filters.scss',
})
export class UiFilters {}
