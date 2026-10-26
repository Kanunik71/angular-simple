import { Component, input, output } from '@angular/core';

import { ToastVariant } from '../../../services/toast.service';
import { UiIcon } from '../icon/ui-icon';

@Component({
  selector: 'ui-toast',
  imports: [UiIcon],
  host: {
    class: 'ui-toast',
    '[class.ui-toast--info]': 'variant() === "info"',
    '[class.ui-toast--error]': 'variant() === "error"',
    '[class.ui-toast--success]': 'variant() === "success"',
  },
  templateUrl: './ui-toast.html',
  styleUrl: './ui-toast.scss',
})
export class UiToast {
  readonly variant = input<ToastVariant>('info');
  readonly message = input.required<string>();
  readonly closed = output<void>();
}
