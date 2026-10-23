import { HttpErrorResponse } from '@angular/common/http';

import { ApiErrorBodyModel } from '../../models/common/common.models';

export class ApiError {
  static code(error: unknown): string | null {
    if (!(error instanceof HttpErrorResponse)) {
      return null;
    }

    const body: unknown = error.error;
    if (isApiErrorBody(body) && body.code.trim().length > 0) {
      return body.code;
    }

    return null;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBodyModel {
  if (typeof value !== 'object' || value === null || !('code' in value)) {
    return false;
  }

  return typeof value.code === 'string';
}
