import { Component, inject } from '@angular/core';

import { ToastService } from '../../ui-core/common/toast/toast.service';
import { UiToast } from '../../ui-core/common/toast/ui-toast';

@Component({
  selector: 'app-toaster',
  imports: [UiToast],
  templateUrl: './app-toaster.html',
  styleUrl: './app-toaster.scss',
})
export class AppToaster {
  protected readonly toastService = inject(ToastService);
}
