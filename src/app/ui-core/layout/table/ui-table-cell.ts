import { Component, input } from '@angular/core';

@Component({
  selector: '[uiTableCell]',
  host: {
    class: 'ui-table__cell',
    '[style.text-align]': 'align()',
  },
  template: '<ng-content />',
  styleUrl: './ui-table-cell.scss',
})
export class UiTableCell {
  readonly align = input<'left' | 'right' | 'center'>('left');
}
