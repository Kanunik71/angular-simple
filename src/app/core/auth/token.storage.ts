import { Injectable } from '@angular/core';

import { TOKEN_STORAGE_KEY } from './token-storage-key';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  read(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  }

  write(token: string): void {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  clear(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
