export class Base64Url {
  static encode(value: string): string {
    return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
  }

  static decode(value: string): string {
    const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
  }
}
