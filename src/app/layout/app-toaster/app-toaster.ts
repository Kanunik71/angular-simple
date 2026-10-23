import { Component, inject } from '@angular/core';

import { UiToast } from '../../ui-core/components/common/toast/ui-toast';
import { ToastService } from '../../ui-core/services/toast.service';

@Component({
  selector: 'app-toaster',
  imports: [UiToast],
  templateUrl: './app-toaster.html',
  styleUrl: './app-toaster.scss',
})
export class AppToaster {
  protected readonly toastService = inject(ToastService);
}
