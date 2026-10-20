import { NgTemplateOutlet } from '@angular/common';
import { Component, Directive, TemplateRef, computed, contentChild, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UiTableCell } from './ui-table-cell';
import { UiTableColumn } from './ui-table';

@Directive({ selector: 'ng-template[uiTableSkeletonRow]' })
export class UiTableSkeletonRow {
  constructor(readonly template: TemplateRef<unknown>) {}
}

@Component({
  selector: 'ui-table-skeleton',
  imports: [NgTemplateOutlet, TranslatePipe, UiTableCell],
  templateUrl: './ui-table-skeleton.html',
  styleUrl: './ui-table.scss',
})
export class UiTableSkeleton {
  readonly columns = input.required<readonly UiTableColumn[]>();
  readonly rows = input(5);

  protected readonly rowTemplate = contentChild.required(UiTableSkeletonRow);
  protected readonly placeholders = computed(() =>
    Array.from({ length: this.rows() }, (_, index) => index),
  );
}
