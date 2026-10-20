import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ToastVariant } from './toast.service';

@Component({
  selector: 'ui-toast',
  imports: [TranslatePipe],
  host: {
    class: 'ui-toast',
    '[class.ui-toast--info]': 'variant() === "info"',
    '[class.ui-toast--error]': 'variant() === "error"',
    '[class.ui-toast--success]': 'variant() === "success"',
    '[attr.role]': 'variant() === "error" ? "alert" : "status"',
  },
  templateUrl: './ui-toast.html',
  styleUrl: './ui-toast.scss',
})
export class UiToast {
  readonly variant = input<ToastVariant>('info');
  readonly message = input.required<string>();
  readonly closed = output<void>();
}
