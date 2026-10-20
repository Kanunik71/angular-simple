import { Signal, computed, signal } from '@angular/core';
import { Observable, catchError, defer, finalize, tap, throwError } from 'rxjs';

export type ComponentStateLoadType<T> = () => Observable<T>;

export interface ComponentStateLoadOptionsType {
  errorMessage: (error: unknown) => string;
}

export class ComponentState {
  private readonly pending = signal<ReadonlySet<number>>(new Set());
  private readonly started = signal(false);
  private readonly ownLoaded = signal(false);
  private readonly errorsState = signal<readonly string[]>([]);
  private readonly childrenState = signal<readonly ComponentState[]>([]);

  private generation = 0;
  private nextToken = 0;

  readonly loading: Signal<boolean> = computed(
    () => this.pending().size > 0 || this.childrenState().some((child) => child.loading()),
  );
  readonly loaded: Signal<boolean> = computed(
    () =>
      (!this.started() || this.ownLoaded()) &&
      this.childrenState().every((child) => child.loaded()),
  );
  readonly errors: Signal<readonly string[]> = computed(() => [
    ...this.errorsState(),
    ...this.childrenState().flatMap((child) => child.errors()),
  ]);
  readonly error: Signal<string | null> = computed(() => this.errors()[0] ?? null);
  readonly hasError: Signal<boolean> = computed(() => this.errors().length > 0);
  readonly initialLoading: Signal<boolean> = computed(() => !this.loaded() && !this.hasError());
  readonly refreshing: Signal<boolean> = computed(() => this.loaded() && this.loading());

  load<T>(
    loader: ComponentStateLoadType<T>,
    options: ComponentStateLoadOptionsType,
  ): Observable<T> {
    return defer(() => {
      const generation = this.generation;
      const token = ++this.nextToken;
      this.started.set(true);
      this.errorsState.set([]);
      this.pending.update((pending) => new Set(pending).add(token));

      return defer(loader).pipe(
        tap({
          complete: () => {
            if (generation === this.generation) {
              this.ownLoaded.set(true);
            }
          },
        }),
        catchError((error: unknown) => {
          if (generation === this.generation) {
            this.errorsState.update((errors) => [...errors, options.errorMessage(error)]);
          }
          return throwError(() => error);
        }),
        finalize(() => {
          this.pending.update((pending) => {
            if (!pending.has(token)) {
              return pending;
            }
            const next = new Set(pending);
            next.delete(token);
            return next;
          });
        }),
      );
    });
  }

  add(child: ComponentState): () => void {
    this.childrenState.update((children) =>
      children.includes(child) ? children : [...children, child],
    );

    return () => {
      this.childrenState.update((children) => children.filter((item) => item !== child));
    };
  }

  reset(): void {
    this.generation++;
    this.pending.set(new Set());
    this.started.set(false);
    this.ownLoaded.set(false);
    this.errorsState.set([]);
  }
}
