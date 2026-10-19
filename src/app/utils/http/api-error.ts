import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorBodyType } from '../../models/common/common.models';

export class ApiError {
  static message(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const body: unknown = error.error;
    if (isApiErrorBody(body) && body.message.trim().length > 0) {
      return body.message;
    }

    return fallback;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBodyType {
  if (typeof value !== 'object' || value === null || !('message' in value)) {
    return false;
  }

  return typeof value.message === 'string';
}
