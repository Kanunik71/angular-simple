import { DestroyRef, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, catchError, map, of, switchMap, tap } from 'rxjs';

import { ListPageType, ListQueryType } from '../../models/common/list.models';
import { ApiError } from '../../utils/http/api-error';

export interface ListStateOptionsType<T, F extends object> {
  initialFilters: F;
  pageSize: number;
  loadErrorKey: string;
  load: (query: ListQueryType<F>) => Observable<ListPageType<T>>;
}

export class ListState<T, F extends object> {
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly options: ListStateOptionsType<T, F>;

  private readonly itemsState = signal<T[]>([]);
  private readonly totalState = signal(0);
  private readonly pageState = signal(1);
  private readonly pageSizeState: WritableSignal<number>;
  private readonly filtersState: WritableSignal<F>;
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly requests = new Subject<ListQueryType<F>>();

  readonly items: Signal<T[]> = this.itemsState.asReadonly();
  readonly total = this.totalState.asReadonly();
  readonly page = this.pageState.asReadonly();
  readonly pageSize = computed(() => this.pageSizeState());
  readonly filters = computed(() => this.filtersState());
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalState() / this.pageSizeState())),
  );

  constructor(options: ListStateOptionsType<T, F>) {
    this.options = options;
    this.pageSizeState = signal(options.pageSize);
    this.filtersState = signal<F>({ ...options.initialFilters });

    this.requests
      .pipe(
        tap(() => {
          this.loadingState.set(true);
          this.errorState.set(null);
        }),
        switchMap((query) =>
          this.options.load(query).pipe(
            map((page) => ({ page, error: null })),
            catchError((error: unknown) =>
              of({
                page: null,
                error: ApiError.message(error, this.translate.instant(this.options.loadErrorKey)),
              }),
            ),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ page, error }) => {
        if (!page) {
          this.loadingState.set(false);
          this.errorState.set(error);
          return;
        }

        const pageCount = Math.max(1, Math.ceil(page.total / this.pageSizeState()));
        if (this.pageState() > pageCount) {
          this.pageState.set(pageCount);
          this.emit();
          return;
        }

        this.itemsState.set(page.items);
        this.totalState.set(page.total);
        this.loadingState.set(false);
      });
  }

  load(): void {
    this.emit();
  }

  reload(): void {
    this.emit();
  }

  loadFirst(): void {
    this.pageState.set(1);
    this.emit();
  }

  setPage(page: number): void {
    const next = Math.max(1, Math.min(page, this.pageCount()));
    if (next === this.pageState()) {
      return;
    }
    this.pageState.set(next);
    this.emit();
  }

  setPageSize(pageSize: number): void {
    const next = Math.max(1, Math.floor(pageSize));
    if (next === this.pageSizeState()) {
      return;
    }
    this.pageSizeState.set(next);
    this.pageState.set(1);
    this.emit();
  }

  setFilters(filters: F): void {
    this.filtersState.set(filters);
    this.pageState.set(1);
    this.emit();
  }

  patchFilters(patch: Partial<F>): void {
    this.filtersState.update((filters) => ({ ...filters, ...patch }));
    this.pageState.set(1);
    this.emit();
  }

  private emit(): void {
    this.requests.next({
      page: this.pageState(),
      pageSize: this.pageSizeState(),
      filters: this.filtersState(),
    });
  }
}
