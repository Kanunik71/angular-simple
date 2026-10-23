import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { ApiErrorCodeEnum } from '../../models/common/common.models';

export class Mock {
  static readonly latencyMs = 400;

  static fail(status: number, codeKey: ApiErrorCodeEnum): Observable<never> {
    return throwError(() => new HttpErrorResponse({ status, error: { code: codeKey } }));
  }

  static record(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  }

  static text(source: Record<string, unknown>, key: string): string {
    const value = source[key];
    return typeof value === 'string' ? value.trim() : '';
  }
}
