import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { UiButton } from '../../common/button/ui-button';

@Component({
  selector: 'ui-pagination',
  imports: [TranslatePipe, UiButton],
  templateUrl: './ui-pagination.html',
  styleUrl: './ui-pagination.scss',
})
export class UiPagination {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly pageChange = output<number>();

  protected previous(): void {
    if (this.page() > 1) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  protected next(): void {
    if (this.page() < this.pageCount()) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
