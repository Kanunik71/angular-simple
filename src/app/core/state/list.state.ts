import { DestroyRef, WritableSignal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, Subject, catchError, switchMap } from 'rxjs';

import { ListPageModel, ListQueryModel } from '../../models/common/list.models';
import { ComponentState } from './component.state';

export interface ListStateOptionsType<T, F extends object> {
  initialFilters: F;
  pageSize: number;
  errorMessage: (error: unknown) => string;
  load: (query: ListQueryModel<F>) => Observable<ListPageModel<T>>;
}

export class ListState<T, F extends object> {
  private readonly destroyRef = inject(DestroyRef);
  private readonly options: ListStateOptionsType<T, F>;

  private readonly itemsState = signal<T[]>([]);
  private readonly totalState = signal(0);
  private readonly pageState = signal(1);
  private readonly pageSizeState: WritableSignal<number>;
  private readonly filtersState: WritableSignal<F>;
  private readonly requests = new Subject<ListQueryModel<F>>();

  readonly loadState = new ComponentState();
  readonly items = this.itemsState.asReadonly();
  readonly total = this.totalState.asReadonly();
  readonly page = this.pageState.asReadonly();
  readonly pageSize = computed(() => this.pageSizeState());
  readonly filters = computed(() => this.filtersState());
  readonly loading = this.loadState.loading;
  readonly loaded = this.loadState.loaded;
  readonly error = this.loadState.error;
  readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalState() / this.pageSizeState())),
  );

  constructor(options: ListStateOptionsType<T, F>) {
    this.options = options;
    this.pageSizeState = signal(options.pageSize);
    this.filtersState = signal<F>({ ...options.initialFilters });

    this.requests
      .pipe(
        switchMap((query) =>
          this.loadState
            .load(() => this.options.load(query), {
              errorMessage: this.options.errorMessage,
            })
            .pipe(catchError(() => EMPTY)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        const pageCount = Math.max(1, Math.ceil(page.total / this.pageSizeState()));
        if (this.pageState() > pageCount) {
          this.pageState.set(pageCount);
          this.emit();
          return;
        }

        this.itemsState.set(page.items);
        this.totalState.set(page.total);
      });
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
