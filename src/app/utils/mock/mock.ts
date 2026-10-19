import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export class Mock {
  static readonly latencyMs = 400;

  static fail(status: number, message: string): Observable<never> {
    return throwError(() => new HttpErrorResponse({ status, error: { message } }));
  }

  static record(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  }

  static text(source: Record<string, unknown>, key: string): string {
    const value = source[key];
    return typeof value === 'string' ? value.trim() : '';
  }
}
