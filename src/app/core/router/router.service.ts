import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RouterService {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  go(url: string, extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigateByUrl(url, extras);
  }

  back(): void {
    this.location.back();
  }
}
