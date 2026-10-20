import { NgTemplateOutlet } from '@angular/common';
import { Component, Directive, TemplateRef, contentChild, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UiTableCell } from './ui-table-cell';

export interface UiTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

@Directive({ selector: 'ng-template[uiTableRow]' })
export class UiTableRow {
  constructor(readonly template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ui-table',
  imports: [NgTemplateOutlet, TranslatePipe, UiTableCell],
  templateUrl: './ui-table.html',
  styleUrl: './ui-table.scss',
})
export class UiTable {
  readonly rows = input.required<readonly unknown[]>();
  readonly columns = input.required<readonly UiTableColumn[]>();
  readonly rowKey = input.required<(row: any) => string | number>();
  readonly emptyLabel = input.required<string>();

  protected readonly rowTemplate = contentChild.required(UiTableRow);
}
